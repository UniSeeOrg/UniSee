import { getAllUsers, createUser } from "@/lib/api/users"; // eslint-disable-line @typescript-eslint/no-unused-vars

export default async function UsersPage() {

  const usersToAdd= [
  { email: "alice@example.com", name: "Alice" },
  { email: "bob@example.com", name: "Bob" },
  { email: "carol@example.com", name: "Carol" },
  ];
  for (const _user of usersToAdd) // eslint-disable-line @typescript-eslint/no-unused-vars
  {
    //Commented out so no duplicates
    //await createUser(user)
  }

  const users = await getAllUsers();
  return (
    <div>
      <h1>Users: </h1>
      {users.map(user => (<div key={user.id}>Name: {user.name} Email: {user.email}</div>))}

    </div>
  );
}
