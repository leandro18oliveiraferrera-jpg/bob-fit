const defaultSchedule = {
    segunda: [
        { id: 1, time: "07:30 - 08:30", activity: "Cross Training", coach: "Prof. Carlos" },
        { id: 2, time: "09:00 - 10:00", activity: "Pilates Avançado", coach: "Prof.ª Mariana" },
        { id: 3, time: "18:30 - 19:30", activity: "Spinning de Alta Intensidade", coach: "Prof. Ricardo" },
        { id: 4, time: "20:00 - 21:00", activity: "Jiu-Jitsu", coach: "Mestre Silva" }
    ],
    terca: [
        { id: 5, time: "08:00 - 09:00", activity: "Yoga Flexibilidade", coach: "Prof.ª Ana" },
        { id: 6, time: "12:30 - 13:30", activity: "Abdominais & Glúteos", coach: "Prof. Carlos" },
        { id: 7, time: "19:00 - 20:00", activity: "Zumba Fitness", coach: "Prof.ª Sofia" }
    ],
    quarta: [
        { id: 8, time: "07:30 - 08:30", activity: "Cross Training", coach: "Prof. Carlos" },
        { id: 9, time: "10:00 - 11:00", activity: "Body Pump", coach: "Prof.ª Rita" },
        { id: 10, time: "18:30 - 19:30", activity: "Spinning", coach: "Prof. Ricardo" }
    ],
    quinta: [
        { id: 11, time: "08:00 - 09:00", activity: "Pilates Clínico", coach: "Prof.ª Mariana" },
        { id: 12, time: "17:30 - 18:30", activity: "Kickboxing", coach: "Prof. Pedro" },
        { id: 13, time: "19:30 - 20:30", activity: "Zumba Fitness", coach: "Prof.ª Sofia" }
    ],
    sexta: [
        { id: 14, time: "07:30 - 08:30", activity: "Cross Training", coach: "Prof. Carlos" },
        { id: 15, time: "12:30 - 13:30", activity: "Funcional Express", coach: "Prof.ª Rita" },
        { id: 16, time: "18:00 - 19:00", activity: "Dance Mix", coach: "Prof.ª Sofia" }
    ],
    sabado: [
        { id: 17, time: "09:30 - 10:30", activity: "Super Core & Alongamentos", coach: "Prof.ª Ana" },
        { id: 18, time: "11:00 - 12:30", activity: "Cross Training Team WOD", coach: "Equipa Nexus" }
    ]
};

let scheduleData = JSON.parse(localStorage.getItem('nexus_schedule')) || defaultSchedule;
let currentActiveDay = 'segunda';

function saveScheduleToStorage() {
    localStorage.setItem('nexus_schedule', JSON.stringify(scheduleData));
}

function renderSchedule(day) {
    currentActiveDay = day;
    const container = document.getElementById('schedule-container');
    if (!container) return; 

    container.innerHTML = '';
    const activities = scheduleData[day] || [];
    const isFuncionario = localStorage.getItem('userRole') === 'funcionario' && localStorage.getItem('isLoggedIn') === 'true';

    if (activities.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#777;">Sem aulas agendadas para este dia.</p>';
        return;
    }

    activities.forEach(item => {
        const deleteButton = isFuncionario 
            ? `<button class="btn-delete" onclick="deleteScheduleItem('${day}', ${item.id})">Remover</button>` 
            : '';

        const html = `
            <div class="schedule-item">
                <div>
                    <div class="time">${item.time}</div>
                    <div class="activity">${item.activity}</div>
                    <div class="coach">${item.coach}</div>
                </div>
                ${deleteButton}
            </div>
        `;
        container.innerHTML += html;
    });
}

function changeDay(day, element) {
    document.querySelectorAll('.day-btn').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
    renderSchedule(day);
}

function handleAddSchedule(event) {
    event.preventDefault();
    
    const day = document.getElementById('form-day').value;
    const time = document.getElementById('form-time').value;
    const activity = document.getElementById('form-activity').value;
    const coach = document.getElementById('form-coach').value;

    const newItem = {
        id: Date.now(),
        time: time,
        activity: activity,
        coach: coach
    };

    if (!scheduleData[day]) scheduleData[day] = [];

    scheduleData[day].push(newItem);
    saveScheduleToStorage();
    
    document.getElementById('add-schedule-form').reset();
    renderSchedule(currentActiveDay);
}

function deleteScheduleItem(day, id) {
    if (confirm("Tens a certeza que desejas remover esta aula do calendário?")) {
        scheduleData[day] = scheduleData[day].filter(item => item.id !== id);
        saveScheduleToStorage();
        renderSchedule(day);
    }
}

function applyCpfMask(input) {
    let value = input.value.replace(/\D/g, ""); 
    if (value.length > 3) value = value.replace(/^(\d{3})(\d)/, "$1.$2");
    if (value.length > 6) value = value.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
    if (value.length > 9) value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
    input.value = value;
}

let currentRole = 'aluno';

function selectRole(role) {
    currentRole = role;
    const btnAluno = document.getElementById('btn-aluno');
    const btnFuncionario = document.getElementById('btn-funcionario');
    const emailLabel = document.getElementById('email-label');
    const btnSubmitText = document.getElementById('btn-submit-text');
    const userEmail = document.getElementById('user-email');

    if (!btnAluno) return; 
    document.getElementById('feedback-message').classList.add('hidden');

    if (role === 'aluno') {
        btnAluno.classList.add('active');
        btnFuncionario.classList.remove('active');
        emailLabel.innerText = "E-mail";
        userEmail.placeholder = "exemplo@email.com";
        btnSubmitText.innerText = "Cadastrar e Entrar como Aluno";
    } else {
        btnFuncionario.classList.add('active');
        btnAluno.classList.remove('active');
        emailLabel.innerText = "E-mail Corporativo";
        userEmail.placeholder = "colaborador@nexusfitness.com";
        btnSubmitText.innerText = "Cadastrar e Entrar como Funcionário";
    }
}

function handleAuth(event) {
    event.preventDefault();
    const email = document.getElementById('user-email').value;
    const feedbackBlock = document.getElementById('feedback-message');

    localStorage.setItem('userEmail', email);
    localStorage.setItem('userRole', currentRole);
    localStorage.setItem('isLoggedIn', 'true');

    let mensagemSucesso = currentRole === 'aluno' 
        ? `🎉 Cadastrado com sucesso! Entrando como Aluno...`
        : `💼 Acesso concedido! Entrando como Funcionário...`;

    feedbackBlock.innerText = mensagemSucesso;
    feedbackBlock.classList.remove('hidden');
    document.getElementById('login-form').reset();

    setTimeout(() => {
        window.location.href = "home.html";
    }, 1500);
}

function logout() {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isLoggedIn');
    window.location.href = "index.html";
}

function checkLoginState() {
    const authArea = document.getElementById('auth-area');
    const adminPanel = document.getElementById('admin-panel');
    
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const email = localStorage.getItem('userEmail');
    const role = localStorage.getItem('userRole');

    // 🔒 BARREIRA DE SEGURANÇA OBRIGATÓRIA
    if (isLoggedIn !== 'true') {
        if (!window.location.pathname.endsWith('index.html') && window.location.pathname !== '/' && window.location.pathname !== '') {
            window.location.href = "index.html";
            return;
        }
    }

    if (isLoggedIn === 'true' && email) {
        if (!authArea) return; 
        
        const badgeColor = role === 'aluno' ? '#00bc1e' : '#00ff2b';
        const badgeText = role === 'aluno' ? '🎓 Aluno' : '💼 Func.';

        authArea.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px; background: #121212; padding: 5px 15px; border-radius: 30px; border: 1px solid rgba(255,255,255,0.05);">
                <span style="font-size: 0.85rem; background: ${badgeColor}; color: #000; padding: 2px 8px; border-radius: 12px; font-weight: bold;">${badgeText}</span>
                <span style="font-size: 0.9rem; color: #e5e7eb; max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${email}</span>
                <button onclick="logout()" style="background: transparent; border: none; color: #ef4444; font-weight: bold; cursor: pointer; font-size: 0.9rem; margin-left: 5px;">Sair</button>
            </div>
        `;

        if (role === 'funcionario' && adminPanel) {
            adminPanel.classList.remove('hidden');
        }
    }
}

window.onload = function() {
    renderSchedule('segunda');
    checkLoginState();

    const urlParams = new URLSearchParams(window.location.search);
    const roleParam = urlParams.get('role');
    if (roleParam) selectRole(roleParam);
};
