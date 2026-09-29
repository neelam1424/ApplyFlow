"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const[error,setError] = useState("");
  const[success,setSuccess] = useState("")


  async function handleSubmit(event:React.FormEvent<HTMLFormElement>){
    event.preventDefault();

    const response = await fetch("http://localhost:8000/auth/register",
        {
            method:"POST",
            headers:{
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                password,
            }),
        }
    );
    const data = await response.json();

    if(!response.ok){
        setError(data.detail || "Registration failed");
        setSuccess("");
    }

    setSuccess("Account created successfully!")
    setError("");




    console.log(data);
  }




  return (
    <main>
      <h1>Create Account</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>

        <button type="submit">
          Create Account
        </button>
      </form>
      {error && (
  <p className="text-red-500">
    {error}
  </p>
)}

{success && (
  <p className="text-green-500">
    {success}
  </p>
)}
    </main>
  );
}