import { getAllUsers } from "@/lib/api/users";
import {createUser } from "@/lib/api/users"
export default async function UsersPage() {

  const usersToAdd= [
  { email: "alice@example.com", name: "Alice" },
  { email: "bob@example.com", name: "Bob" },
  { email: "carol@example.com", name: "Carol" },
  ];
  for (let user of usersToAdd)
  {
    //Commented out so no duplicates
    //await createUser(user)
  }

  const users = await getAllUsers();
  return (
    <div>
      <h1>Users: </h1>
      {users.map(user => (<div>Name: {user.name} Email: {user.email}</div>))}

    </div>
  );
}
