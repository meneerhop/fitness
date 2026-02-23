import { auth, db } from './firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, setDoc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

window.showLogin = () => {
  authContainer.classList.add('hidden');
  loginContainer.classList.remove('hidden');
};

window.showRegister = () => {
  authContainer.classList.add('hidden');
  registerContainer.classList.remove('hidden');
};

window.login = async () => {
  const email = loginEmail.value;
  const password = loginPassword.value;
  await signInWithEmailAndPassword(auth, email, password);
};

window.register = async () => {
  const name = regName.value;
  const email = regEmail.value;
  const password = regPassword.value;
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, "users", userCred.user.uid), { name: name, role: "user" });
};

window.logout = async () => {
  await signOut(auth);
};

onAuthStateChanged(auth, async user => {
  if(user){
    authContainer.classList.add('hidden');
    loginContainer.classList.add('hidden');
    registerContainer.classList.add('hidden');
    appContainer.classList.remove('hidden');

    const userDoc = await getDoc(doc(db,"users",user.uid));
    const data = userDoc.data();
    welcomeText.innerText = "Welkom " + data.name;

    if(data.role === "admin"){
      adminPanel.classList.remove('hidden');
      const usersSnap = await getDocs(collection(db,"users"));
      userList.innerHTML = "";
      usersSnap.forEach(doc => {
        userList.innerHTML += "<div>"+doc.data().name+"</div>";
      });
    }

    buildCalendar();
  } else {
    appContainer.classList.add('hidden');
    authContainer.classList.remove('hidden');
  }
});

function buildCalendar(){
  calendar.innerHTML = "";
  for(let i=1;i<=30;i++){
    calendar.innerHTML += `<div class="day">${i}</div>`;
  }
}
