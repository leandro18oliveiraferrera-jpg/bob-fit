// ==========================================
// BASE DE DADOS DO CALENDÁRIO DE HORÁRIOS
// ==========================================
const scheduleData = {
    segunda: [
        { time: "07:30 - 08:30", activity: "Cross Training", coach: "Prof. Carlos" },
        { time: "09:00 - 10:00", activity: "Pilates Avançado", coach: "Prof.ª Mariana" },
        { time: "18:30 - 19:30", activity: "Spinning de Alta Intensidade", coach: "Prof. Ricardo" },
        { time: "20:00 - 21:00", activity: "Jiu-Jitsu", coach: "Mestre Silva" }
    ],
    terca: [
        { time: "08:00 - 09:00", activity: "Yoga Flexibilidade", coach: "Prof.ª Ana" },
        { time: "12:30 - 13:30", activity: "Abdominais & Glúteos", coach: "Prof. Carlos" },
        { time: "19:00 - 20:00", activity: "Zumba Fitness", coach: "Prof.ª Sofia" }
    ],
    quarta: [
        { time: "07:30 - 08:30", activity: "Cross Training", coach: "Prof. Carlos" },
        { time: "10:00 - 11:00", activity: "Body Pump", coach: "Prof.ª Rita" },
        { time: "18:30 - 19:30", activity: "Spinning", coach: "Prof. Ricardo" }
    ],
    quinta: [
        { time: "08:00 - 09:00", activity: "Pilates Clínico", coach: "Prof.ª Mariana" },
        { time: "17:30 - 18:30", activity: "Kickboxing", coach: "Prof. Pedro" },
        { time: "19:30 - 20:30", activity: "Zumba Fitness", coach: "Prof.ª Sofia" }
    ],
    sexta: [
        { time: "07:30 - 08:30", activity: "Cross Training", coach: "Prof. Carlos" },
        { time: "12:30 - 13:30", activity: "Funcional Express", coach: "Prof.ª Rita" },
        { time: "18:00 - 19:00", activity: "Dance Mix", coach: "Prof.ª Sofia" }
    ],
    sabado: [
        { time: "09:30 - 10:30", activity: "Super Core & Alongamentos", coach: "Prof.ª Ana" },
        { time: "11:00 - 12:30", activity: "Cross Training Team WOD", coach: "Equipa Nexus" }
    ]
};

// Variável para controlar qual dia está ativo na visualização atual
let currentActiveDay = 'segunda';

function renderSchedule(day) {
    currentActiveDay = day;
    const container = document.getElementById('schedule-container');
    if (!container) return; 

    container.innerHTML = '';
    const activities = scheduleData[day] || [];

    if (activities.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#9ca3af;">Sem aulas agendadas para este dia.</p>';
        return;
    }

    activities.forEach((item, index) => {
        const isFuncionario = localStorage.getItem('userRole') === 'funcionario';
        // Se for funcionário, mostra um botão para deletar a atividade
        const deleteBtnHtml = isFuncionario 
            ? `<button class="btn-delete" onclick="handleDeleteSchedule('${day}', ${index})">Excluir</button>` 
            : '';

        const html = `
            <div class="schedule-item">
                <div class="time">${item.time}</div>
                <div class="activity">${item.activity}</div>
                <div class="coach">${item.coach}</div>
                ${deleteBtnHtml}
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

// Lógica para o funcionário adicionar novas aulas ao calendário
function handleAddSchedule(event) {
    event.preventDefault();
    
    const day = document.getElementById('form-day').value;
    const time = document.getElementById('form-time').value;
    const activity = document.getElementById('form-activity').value;
    const coach = document.getElementById('form-coach').value;

    if (!scheduleData[day]) {
        scheduleData[day] = [];
    }

    scheduleData[day].push({ time, activity, coach });
    
    // Reseta o formulário e atualiza a lista na tela se for o dia atual
    document.getElementById('add-schedule-form').reset();
    alert("Aula adicionada com sucesso!");
    
    if (day === currentActiveDay) {
        renderSchedule(day);
    }
}

// Lógica para deletar aulas do calendário
function handleDeleteSchedule(day, index) {
    if (confirm("Tem certeza que deseja remover esta aula?")) {
        scheduleData[day].splice(index, 1);
        renderSchedule(day);
    }
}

// ==========================================
// MÁSCARA AUTOMÁTICA DE CPF
// ==========================================
function applyCpfMask(input) {
    let value = input.value.replace(/\D/g, ""); 
    if (value.length > 3) value = value.replace(/^(\d{3})(\d)/, "$1.$2");
    if (value.length > 6) value = value.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
    if (value.length > 9) value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
    input.value = value;
}

// ==========================================
// LÓGICA DE LOGIN, CADASTRO E ENTRADA
// ==========================================
let currentRole = 'aluno';

function selectRole(role) {
    currentRole = role;
    
    const btnAluno = document.getElementById('btn-aluno');
    const btnFuncionario = document.getElementById('btn-funcionario');
    const emailLabel = document.getElementById('email-label');
    const btnSubmitText = document.getElementById('btn-submit-text');
    const userEmail = document.getElementById('user-email');

    if (!btnAluno) return; 

    // Limpa feedbacks antigos
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

    // Salva a sessão ativa no navegador
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userRole', currentRole);
    localStorage.setItem('isLoggedIn', 'true');

    // Mensagem de sucesso
    let mensagemSucesso = currentRole === 'aluno' 
        ? `🎉 Cadastrado com sucesso! Entrando como Aluno...`
        : `💼 Acesso concedido! Entrando como Funcionário...`;

    feedbackBlock.innerText = mensagemSucesso;
    feedbackBlock.classList.remove('hidden');
    feedbackBlock.className = "feedback success";

    document.getElementById('login-form').reset();

    // Redireciona para a página principal
    setTimeout(() => {
        window.location.href = "index.html";
    }, 2000);
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

    // Exibe o painel administrativo se o usuário logado for funcionário
    if (isLoggedIn === 'true' && role === 'funcionario') {
        if (adminPanel) adminPanel.classList.remove('hidden');
    } else {
        if (adminPanel) adminPanel.classList.add('hidden');
    }

    if (!authArea) return;

    if (isLoggedIn === 'true' && email) {
        const badgeColor = role === 'aluno' ? '#6366f1' : '#10b981';
        const badgeText = role === 'aluno' ? '🎓 Aluno' : '💼 Func.';

        authArea.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px; background: rgba(255,255,255,0.05); padding: 5px 15px; border-radius: 30px; border: 1px solid rgba(255,255,255,0.1);">
                <span style="font-size: 0.85rem; background: ${badgeColor}; color: white; padding: 2px 8px; border-radius: 12px; font-weight: bold;">${badgeText}</span>
                <span style="font-size: 0.9rem; color: #e5e7eb; max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${email}</span>
                <button onclick="logout()" style="background: transparent; border: none; color: #ef4444; font-weight: bold; cursor: pointer; font-size: 0.9rem; margin-left: 5px;">Sair</button>
            </div>
        `;
    }
}

// ==========================================
// GERENCIAMENTO DE AVISOS DINÂMICOS
// ==========================================
const defaultAnnouncement = "⚠️ Nota: As aulas de grupo seguem a marcação específica do calendário abaixo.";

function renderAnnouncement() {
    const announcementBlock = document.getElementById('gym-announcement');
    if (!announcementBlock) return;

    // Busca o aviso personalizado ou usa o texto padrão inicial
    const activeAnnouncement = localStorage.getItem('nexus_announcement') || defaultAnnouncement;
    announcementBlock.innerText = activeAnnouncement;
}

function handleUpdateAnnouncement(newText) {
    if (!newText || newText.trim() === "") {
        alert("Por favor, digite um aviso válido!");
        return;
    }
    localStorage.setItem('nexus_announcement', newText.trim());
    renderAnnouncement();
}

// ==========================================
// EXECUÇÃO INICIAL
// ==========================================
window.onload = function() {
    renderSchedule('segunda');
    checkLoginState();
    renderAnnouncement();

    const urlParams = new URLSearchParams(window.location.search);
    const roleParam = urlParams.get('role');
    if (roleParam) selectRole(roleParam);
}
