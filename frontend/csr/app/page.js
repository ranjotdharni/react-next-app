
export default async function page()
{
    const data = await grabData();

    return (
        <div>
            <h1>Welcome to the home page!</h1>
            <p>{data.message}</p>
        </div>
    );
}

async function grabData()
{
    const res = await fetch('https://meteorize-backend.onrender.com/v1', {
      method: "GET",
      headers: {
        "AUTH-TOKEN": process.env.AUTH_TOKEN,
      }
    });
    return await res.json();
}