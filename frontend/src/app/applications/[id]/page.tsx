"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type ApplicationStatus =
  | "SAVED"
  | "APPLIED"
  | "OA"
  | "RECRUITER_SCREEN"
  | "INTERVIEW"
  | "FINAL_ROUND"
  | "OFFER"
  | "REJECTED"
  | "WITHDRAWN";

type ApplicationPlatform =
  | "LINKEDIN"
  | "HANDSHAKE"
  | "INDEED"
  | "COMPANY_WEBSITE"
  | "REFERRAL"
  | "CAREER_FAIR"
  | "OTHER";

type Application = {
  id: number;
  company: string;
  role: string;
  status: ApplicationStatus;

  platform: ApplicationPlatform | null;
  job_url: string | null;
  salary: string | null;
  skills_aligned: string | null;
  date_applied: string | null;
  deadline: string | null;
  location: string | null;
  notes: string | null;

  created_at: string;
  updated_at: string;
};

export default function ApplicationDetailsPage() {
  const params = useParams();
  const router = useRouter();

  // ---------------------------------------------
  // APPLICATION STATE
  // ---------------------------------------------

  const [application, setApplication] =
    useState<Application | null>(null);

  // ---------------------------------------------
  // FORM STATE
  // ---------------------------------------------

  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");

  const [status, setStatus] =
    useState<ApplicationStatus>("SAVED");

  const [platform, setPlatform] =
    useState<ApplicationPlatform | "">("");

  const [jobUrl, setJobUrl] = useState("");
  const [salary, setSalary] = useState("");
  const [skillsAligned, setSkillsAligned] = useState("");
  const [dateApplied, setDateApplied] = useState("");
  const [deadline, setDeadline] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  // ---------------------------------------------
  // UI STATE
  // ---------------------------------------------

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // =============================================
  // GET ONE APPLICATION
  // =============================================

  useEffect(() => {
    const storedToken =
      localStorage.getItem("access_token");

    if (!storedToken) {
      router.push("/login");
      return;
    }

    async function fetchApplication() {
      try {
        const response = await fetch(
          `http://localhost:8000/applications/${params.id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem("access_token");
            router.push("/login");
            return;
          }

          if (response.status === 404) {
            setError("Application not found.");
            return;
          }

          console.log(
            "Failed to fetch application:",
            data
          );

          setError("Failed to load application.");
          return;
        }

        // Store returned application
        setApplication(data);

        // Fill form using existing database values
        setCompany(data.company);
        setRole(data.role);
        setStatus(data.status);

        setPlatform(data.platform ?? "");

        setJobUrl(data.job_url ?? "");
        setSalary(data.salary ?? "");
        setSkillsAligned(data.skills_aligned ?? "");
        setDateApplied(data.date_applied ?? "");
        setDeadline(data.deadline ?? "");
        setLocation(data.location ?? "");
        setNotes(data.notes ?? "");
      } catch (error) {
        console.log(
          "Fetch application error:",
          error
        );

        setError(
          "Could not connect to the server."
        );
      }
    }

    fetchApplication();
  }, [params.id, router]);

  // =============================================
  // UPDATE APPLICATION
  // =============================================

  async function handleUpdate(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");
    setError("");

    const storedToken =
      localStorage.getItem("access_token");

    if (!storedToken) {
      router.push("/login");
      return;
    }

    if (!company.trim() || !role.trim()) {
      setError("Company and role are required.");
      return;
    }

    setIsUpdating(true);

    try {
      const response = await fetch(
        `http://localhost:8000/applications/${params.id}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${storedToken}`,
          },

          body: JSON.stringify({
            company,
            role,
            status,
            platform: platform || null,
            job_url: jobUrl || null,
            salary: salary || null,
            skills_aligned: skillsAligned || null,
            date_applied: dateApplied || null,
            deadline: deadline || null,
            location: location || null,
            notes: notes || null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("access_token");
          router.push("/login");
          return;
        }

        if (response.status === 404) {
          setError("Application not found.");
          return;
        }

        console.log(
          "Failed to update application:",
          data
        );

        setError(
          "Failed to update application."
        );

        return;
      }

      // Backend returns updated application
      setApplication(data);

      // Synchronize form with returned data
      setCompany(data.company);
      setRole(data.role);
      setStatus(data.status);
      setPlatform(data.platform ?? "");
      setJobUrl(data.job_url ?? "");
      setSalary(data.salary ?? "");
      setSkillsAligned(data.skills_aligned ?? "");
      setDateApplied(data.date_applied ?? "");
      setDeadline(data.deadline ?? "");
      setLocation(data.location ?? "");
      setNotes(data.notes ?? "");

      setMessage(
        "Application updated successfully."
      );
    } catch (error) {
      console.log(
        "Update application error:",
        error
      );

      setError(
        "Could not connect to the server."
      );
    } finally {
      setIsUpdating(false);
    }
  }

  // =============================================
  // DELETE APPLICATION
  // =============================================

  async function handleDelete() {
    setMessage("");
    setError("");

    const storedToken =
      localStorage.getItem("access_token");

    if (!storedToken) {
      router.push("/login");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete the application for ${company}?`
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(
        `http://localhost:8000/applications/${params.id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("access_token");
          router.push("/login");
          return;
        }

        if (response.status === 404) {
          setError("Application not found.");
          return;
        }

        setError(
          "Failed to delete application."
        );

        return;
      }

      // DELETE returns 204 No Content
      // so there is no response.json()

      router.push("/dashboard");
    } catch (error) {
      console.log(
        "Delete application error:",
        error
      );

      setError(
        "Could not connect to the server."
      );
    } finally {
      setIsDeleting(false);
    }
  }

  // =============================================
  // ERROR BEFORE APPLICATION LOADS
  // =============================================

  if (error && !application) {
    return (
      <main className="min-h-screen bg-white p-10 text-black">
        <h1 className="text-3xl font-bold">
          Application Details
        </h1>

        <p className="mt-4 text-red-600">
          {error}
        </p>

        <button
          type="button"
          onClick={() =>
            router.push("/dashboard")
          }
          className="mt-6 border px-4 py-2"
        >
          Back to Dashboard
        </button>
      </main>
    );
  }

  // =============================================
  // LOADING
  // =============================================

  if (!application) {
    return (
      <main className="min-h-screen bg-white p-10 text-black">
        <p>Loading...</p>
      </main>
    );
  }

  // =============================================
  // PAGE
  // =============================================

  return (
    <main className="min-h-screen bg-white p-10 text-black">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold">
          Application Details
        </h1>

        <p className="mt-2 text-gray-600">
          Application ID: {application.id}
        </p>

        <form
          onSubmit={handleUpdate}
          className="mt-8 flex flex-col gap-5"
        >
          {/* COMPANY */}

          <div>
            <label
              htmlFor="company"
              className="mb-1 block font-medium"
            >
              Company *
            </label>

            <input
              id="company"
              type="text"
              value={company}
              onChange={(event) =>
                setCompany(event.target.value)
              }
              required
              className="w-full rounded border p-2"
            />
          </div>

          {/* ROLE */}

          <div>
            <label
              htmlFor="role"
              className="mb-1 block font-medium"
            >
              Role *
            </label>

            <input
              id="role"
              type="text"
              value={role}
              onChange={(event) =>
                setRole(event.target.value)
              }
              required
              className="w-full rounded border p-2"
            />
          </div>

          {/* STATUS */}

          <div>
            <label
              htmlFor="status"
              className="mb-1 block font-medium"
            >
              Status
            </label>

            <select
              id="status"
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target
                    .value as ApplicationStatus
                )
              }
              className="w-full rounded border p-2"
            >
              <option value="SAVED">
                Saved
              </option>

              <option value="APPLIED">
                Applied
              </option>

              <option value="OA">
                OA
              </option>

              <option value="RECRUITER_SCREEN">
                Recruiter Screen
              </option>

              <option value="INTERVIEW">
                Interview
              </option>

              <option value="FINAL_ROUND">
                Final Round
              </option>

              <option value="OFFER">
                Offer
              </option>

              <option value="REJECTED">
                Rejected
              </option>

              <option value="WITHDRAWN">
                Withdrawn
              </option>
            </select>
          </div>

          {/* PLATFORM */}

          <div>
            <label
              htmlFor="platform"
              className="mb-1 block font-medium"
            >
              Platform
            </label>

            <select
              id="platform"
              value={platform}
              onChange={(event) =>
                setPlatform(
                  event.target.value as
                    | ApplicationPlatform
                    | ""
                )
              }
              className="w-full rounded border p-2"
            >
              <option value="">
                Select platform
              </option>

              <option value="LINKEDIN">
                LinkedIn
              </option>

              <option value="HANDSHAKE">
                Handshake
              </option>

              <option value="INDEED">
                Indeed
              </option>

              <option value="COMPANY_WEBSITE">
                Company Website
              </option>

              <option value="REFERRAL">
                Referral
              </option>

              <option value="CAREER_FAIR">
                Career Fair
              </option>

              <option value="OTHER">
                Other
              </option>
            </select>
          </div>

          {/* JOB URL */}

          <div>
            <label
              htmlFor="jobUrl"
              className="mb-1 block font-medium"
            >
              Job URL
            </label>

            <input
              id="jobUrl"
              type="url"
              value={jobUrl}
              onChange={(event) =>
                setJobUrl(event.target.value)
              }
              placeholder="https://company.com/jobs/123"
              className="w-full rounded border p-2"
            />
          </div>

          {/* SALARY */}

          <div>
            <label
              htmlFor="salary"
              className="mb-1 block font-medium"
            >
              Salary
            </label>

            <input
              id="salary"
              type="text"
              value={salary}
              onChange={(event) =>
                setSalary(event.target.value)
              }
              placeholder="$100,000 - $120,000"
              className="w-full rounded border p-2"
            />
          </div>

          {/* SKILLS ALIGNED */}

          <div>
            <label
              htmlFor="skillsAligned"
              className="mb-1 block font-medium"
            >
              Skills Aligned
            </label>

            <input
              id="skillsAligned"
              type="text"
              value={skillsAligned}
              onChange={(event) =>
                setSkillsAligned(
                  event.target.value
                )
              }
              placeholder="Python, FastAPI, PostgreSQL"
              className="w-full rounded border p-2"
            />
          </div>

          {/* DATE APPLIED */}

          <div>
            <label
              htmlFor="dateApplied"
              className="mb-1 block font-medium"
            >
              Date Applied
            </label>

            <input
              id="dateApplied"
              type="date"
              value={dateApplied}
              onChange={(event) =>
                setDateApplied(
                  event.target.value
                )
              }
              className="w-full rounded border p-2"
            />

            <p className="mt-1 text-sm text-gray-500">
              If you change the status to Applied
              and no application date exists, the
              backend can automatically set it.
            </p>
          </div>

          {/* DEADLINE */}

          <div>
            <label
              htmlFor="deadline"
              className="mb-1 block font-medium"
            >
              Deadline
            </label>

            <input
              id="deadline"
              type="date"
              value={deadline}
              onChange={(event) =>
                setDeadline(event.target.value)
              }
              className="w-full rounded border p-2"
            />
          </div>

          {/* LOCATION */}

          <div>
            <label
              htmlFor="location"
              className="mb-1 block font-medium"
            >
              Location
            </label>

            <input
              id="location"
              type="text"
              value={location}
              onChange={(event) =>
                setLocation(event.target.value)
              }
              placeholder="New York, NY"
              className="w-full rounded border p-2"
            />
          </div>

          {/* NOTES */}

          <div>
            <label
              htmlFor="notes"
              className="mb-1 block font-medium"
            >
              Notes
            </label>

            <textarea
              id="notes"
              value={notes}
              onChange={(event) =>
                setNotes(event.target.value)
              }
              rows={5}
              placeholder="Interview notes, recruiter information, follow-up..."
              className="w-full rounded border p-2"
            />
          </div>

          {/* CREATED AT */}

          <div>
            <p className="text-sm text-gray-500">
              Created:{" "}
              {new Date(
                application.created_at
              ).toLocaleString()}
            </p>

            <p className="text-sm text-gray-500">
              Last Updated:{" "}
              {new Date(
                application.updated_at
              ).toLocaleString()}
            </p>
          </div>

          {/* ERROR */}

          {error && (
            <p className="text-red-600">
              {error}
            </p>
          )}

          {/* SUCCESS */}

          {message && (
            <p className="text-green-600">
              {message}
            </p>
          )}

          {/* UPDATE */}

          <button
            type="submit"
            disabled={isUpdating || isDeleting}
            className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            {isUpdating
              ? "Updating..."
              : "Update Application"}
          </button>
        </form>

        {/* DELETE */}

        <button
          type="button"
          onClick={handleDelete}
          disabled={isUpdating || isDeleting}
          className="mt-4 w-full rounded bg-red-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {isDeleting
            ? "Deleting..."
            : "Delete Application"}
        </button>

        {/* BACK */}

        <button
          type="button"
          onClick={() =>
            router.push("/dashboard")
          }
          className="mt-4 w-full rounded border px-4 py-2"
        >
          Back to Dashboard
        </button>
      </div>
    </main>
  );
}