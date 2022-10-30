export const verifyLogin = async () => {
    const response = await axios.get('http://localhost:5000/users', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    setUsers(response.data);
}

return (
    <div className="container mt-5">
        <h1>Welcome Back: {name}</h1>
        <table className="table is-striped is-fullwidth">
            <thead>
            <tr>
                <th>No</th>
                <th>Name</th>
                <th>Email</th>
            </tr>
            </thead>
            <tbody>
            {users.map((user, index) => (
                <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                </tr>
            ))}

            </tbody>
        </table>
    </div>
)
