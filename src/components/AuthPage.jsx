import styles from "./AuthPage.module.css";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function LogIn({ setMode }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    fetch('/api/login', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: name, // 수정: 하드코딩된 값을 사용자가 입력한 값으로 변경
        userPassword: password // 수정: 하드코딩된 값을 사용자가 입력한 값으로 변경
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.isLogin === "True") {
          navigate("/feed"); // 로그인 성공 시 피드 페이지로 이동
        } else {
          alert(json.isLogin); // 로그인 실패 시 에러 메시지 표시
        }
      })
      .catch((error) => { // 예기치 않은 예외 상황을 처리
        console.error("Error:", error);
        alert("로그인 처리 중 오류가 발생했습니다.");
      });
  };

  return (
    <div className={styles.authBackground}>
      <div className={styles.loginForm}>
        <p>
          <input
            className={styles.login}
            type="text"
            placeholder="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </p>
        <p>
          <input
            className={styles.login}
            type="password"
            placeholder="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </p>
        <p>
          <input
            className={styles.authBtn}
            type="button"
            value="LogIn"
            onClick={handleLogin}
          />
        </p>
      </div>
    </div>
  );
}

function SignUp({ setMode }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const navigate = useNavigate();

const handleSignup = () => {

  // 회원가입 요청
  fetch('/api/signup', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: name, // 수정: 하드코딩된 값을 사용자가 입력한 값으로 변경
      userPassword: password, // 수정: 하드코딩된 값을 사용자가 입력한 값으로 변경
      userPassword2: password2 // 수정: 비밀번호 확인 값 추가
    }),
  })
    .then((res) => res.json())
    .then((json) => {
      if (json.isSuccess === "True") {
        alert("SignUp successful");
        setMode("LOGIN");
        navigate("/auth?mode=login");
      } else {
        alert(json.isSuccess); // 서버에서 받은 오류 메시지 표시
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("회원가입 처리 중 오류가 발생했습니다.");
    });
};

  return (
    <div className={styles.authBackground}>
      <div className={styles.signupForm}>
        <p>
          <input
            className={styles.login}
            type="text"
            placeholder="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </p>
        <p>
          <input
            className={styles.login}
            type="password"
            placeholder="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </p>
        <p>
          <input
            className={styles.login}
            type="password"
            placeholder="confirm password"
            value={password2}
            onChange={(event) => setPassword2(event.target.value)}
          />
        </p>
        <p>
          <input
            className={styles.authBtn}
            type="button" // 수정: type을 "button"으로 변경
            value="SignUp"
            onClick={handleSignup}
          />
        </p>
      </div>
    </div>
  );
}

function Auth() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mode, setMode] = useState("LOGIN");

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const modeFromQuery = queryParams.get("mode");
    if (modeFromQuery) {
      setMode(modeFromQuery.toUpperCase());
    }
  }, [location]);

  const handleModeChange = (newMode) => {
    setMode(newMode);
    navigate(`/auth?mode=${newMode}`);
  };

  let content = null;

  if (mode === "LOGIN") {
    content = <LogIn setMode={handleModeChange} />;
  } else if (mode === "SIGNUP") {
    content = <SignUp setMode={handleModeChange} />;
  }

  return (

    <div className={styles.authBackground}> 
      {content}
    </div>
  );
}

export default Auth;
