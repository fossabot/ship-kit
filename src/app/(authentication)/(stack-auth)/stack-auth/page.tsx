import { ensureUserHasTeam, getTeamProjects } from "@/server/utils/team-utils";
import { stackServerApp } from "@/stack";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await stackServerApp.getUser({ or: "redirect" });
  console.log("user", user);

  let teamId;
  let projects;
  let error;

  try {
    teamId = await ensureUserHasTeam(user);
    projects = await getTeamProjects(teamId);
  } catch (err) {
    console.error("Error ensuring user has team:", err);
    error = "An error occurred while setting up your dashboard. Please try again later.";
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to your dashboard!</h1>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Projects</h2>
          {projects && projects.map((project) => (
            <div key={project.id} className="bg-white shadow rounded-lg p-4 mb-4">
              <h3 className="text-xl font-medium">{project.name}</h3>
              <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Create API Key
              </button>
            </div>
          ))}
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Create New Project
          </button>
        </div>
      )}
      <Link href="/api-keys/test" className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
        Create Test API Key
      </Link>
    </div>
  );
}