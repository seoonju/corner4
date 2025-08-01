import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import "../styles/Account.css";
import bookIcon from "../assets/bookicon.png";
import lamp from "../assets/lamp.png";

const Account = () => {
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [nicknameError, setNicknameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const navigate = useNavigate(); 

  const validateEmail = (value) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!value) return "이메일을 입력해주세요.";
    if (!emailRegex.test(value)) return "올바른 이메일 형식이 아닙니다.";
    return "";
  };

  const validateNickname = (value) => {
    if (!value) return "닉네임을 입력해주세요.";
    if (value.length < 2 || value.length > 10) return "닉네임은 2~10자 사이여야 합니다.";
    return "";
  };

  const validatePassword = (value) => {
    const passwordRegex = /^[a-zA-Z0-9!@*&-_]{8,16}$/; // Adjusted regex to avoid overlap
    if (!value) return "비밀번호를 입력해주세요.";
    if (!passwordRegex.test(value)) return "비밀번호는 8~16자의 영문, 숫자, 특수문자(!@*&-_)만 가능합니다.";
    return "";
  };

  const validateConfirmPassword = (value) => {
    if (value !== password) return "비밀번호가 일치하지 않습니다.";
    return "";
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setEmailError(validateEmail(value));
  };

  const handleNicknameChange = (e) => {
    const value = e.target.value;
    setNickname(value);
    setNicknameError(validateNickname(value));
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordError(validatePassword(value));
    setConfirmError(validateConfirmPassword(confirmPassword));
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setConfirmError(validateConfirmPassword(value));
  };

  //회원가입 API 연동
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailError && !nicknameError && !passwordError && !confirmError) {
      try {
        // 프록시 사용 fetch 코드 수정
        const response = await fetch("/auth/join", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            nick: nickname,
            password
          }),
          credentials: "include" // 쿠키 포함
        });
        

        if (response.ok) {
          alert("회원가입이 완료되었습니다!");
          navigate("/login"); // 로그인 페이지로 이동 기능 추가가
        } else {
          const errorData = await response.json();
          alert(errorData.message || "회원가입 실패");
        }
      } catch (error) {
        console.error("회원가입 오류:", error);
        alert("서버 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="main-container">
      <header className="header">
        <div className="img-group">
          <img src={lamp} className="lamp" alt="lamp" />
          <img src={lamp} className="lamp" alt="lamp" />
          <img src={lamp} className="lamp" alt="lamp" />
        </div>
        <div className="nav-group">
          <div className="nav-item">
            <Link to="/account">회원가입</Link>
            <img src={bookIcon} className="book-icon" alt="book icon" />
          </div>
          <div className="nav-item">
            <Link to="/login">로그인</Link>
            <div className="underline"></div>
          </div>
          <div className="nav-item">
            <Link to="/myDrawer">나의 서랍</Link>
            <div className="underline"></div>
          </div>
        </div>
      </header>

      <div className="login-container">
        <div className="login-box">
          <div className="login-header">
            <img
              src="https://cdn-icons-png.flaticon.com/512/847/847969.png"
              className="login-icon"
              alt="user icon"
            />
            <h2>회원가입</h2>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <label>이메일</label>
            <input type="email" className="login-input" value={email} onChange={handleEmailChange} />
            {emailError && <p className="error-message">{emailError}</p>}

            <label>닉네임</label>
            <input type="text" className="login-input" value={nickname} onChange={handleNicknameChange} />
            {nicknameError && <p className="error-message">{nicknameError}</p>}

            <label>비밀번호</label>
            <input type="password" className="login-input" value={password} onChange={handlePasswordChange} />
            {passwordError && <p className="error-message">{passwordError}</p>}

            <label>비밀번호 확인</label>
            <input type="password" className="login-input" value={confirmPassword} onChange={handleConfirmPasswordChange} />
            {confirmError && <p className="error-message">{confirmError}</p>}

            <button className="login-button" type="submit">회원가입</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Account;