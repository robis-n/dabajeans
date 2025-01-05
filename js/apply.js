document.addEventListener('DOMContentLoaded', () => {
    const applyOverlay = document.getElementById('applyOverlay');
    const openapplyBtn = document.getElementById('openApply');
    const applyClose = document.getElementById('applyClose');

    openapplyBtn.addEventListener('click', openapply);
    applyClose.addEventListener('click', closeapply);

    applyOverlay.addEventListener('click', (e) => {
        if (e.target === applyOverlay) {
            closeapply();
        }
    });
});

function openapply() {
    applyOverlay.style.display = 'flex';
    setTimeout(() => applyOverlay.classList.add('active'), 10);
}

function closeapply() {
    applyOverlay.classList.remove('active');
    setTimeout(() => {
        applyOverlay.style.display = 'none';
    }, 300);
}

function sendApply(){
    let parms = {
        name: document.getElementById('name-surname-apply').value,
        email: document.getElementById('email-apply').value,
        phone: document.getElementById('phone-apply').value,
        experience: document.getElementById('exp-apply').value,
    }

    emailjs.send("service_bhj4p37","template_08bfn07",parms).then(alert("Email Sent! We will contact you soon!"));
}