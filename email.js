function sendMail(){
    let parms = {
        name: document.getElementById('name-email').value,
        email: document.getElementById('email-email').value,
        phone: document.getElementById('phone-email').value,
        jeans: document.getElementById('jean-name-email').value,
        comment: document.getElementById('comment-email').value,
    }

    emailjs.send("service_bhj4p37","template_2y0oe3c",{
        name: "robis",
        email: "robis.niko@gmail.com",
        phone: "26330969",
        jeans: "puķes",
        comment: "s izmers",
        });
}