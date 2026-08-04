import { useState, useEffect } from "react";

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  return (
    <ul>
      {users.map((user) => (
        <li key={user.userId}>
          {user.userName} — {user.userEmail}
        </li>
      ))}
    </ul>
  );
}

export default Users;