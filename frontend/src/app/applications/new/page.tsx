"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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

export default function NewApplicationPage() {
  const router = useRouter();

  // Required fields
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");

  // Application status
  const [status, setStatus] =
    useState<ApplicationStatus>("SAVED");

  // Optional fields
  const [platform, setPlatform] =
    useState<ApplicationPlatform | "">("");

  const [jobUrl, setJobUrl] = useState("");
  const [salary, setSalary] = useState("");
  const [skillsAligned, setSkillsAligned] = useState("");
  const [dateApplied, setDateApplied] = useState("");
  const [deadline, setDeadline] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");

  // UI state
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    const token = localStorage.getItem("access_token");

    if (!token) {
      router.push("/login");
      return;
    }

    if (!company.trim() || !role.trim()) {
      setError("Company and role are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(
        "http://localhost:8000/applications",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            company,
            role,
            status,

            // Convert empty optional fields to null
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

        console.log("Failed to create application:", data);

        setError("Failed to create application.");
        return;
      }

      console.log("Created application:", data);

      router.push("/dashboard");
    } catch (error) {
      console.log("Create application error:", error);

      setError(
        "Could not connect to the server. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-white p-10 text-black">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold">
          Add Application
        </h1>

        <p className="mt-2 text-gray-600">
          Add a job application to your tracker.
        </p>

        <form
          onSubmit={handleSubmit}
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
              placeholder="Google"
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
              placeholder="Software Engineer"
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
                  event.target.value as ApplicationStatus
                )
              }
              className="w-full rounded border p-2"
            >
              <option value="SAVED">Saved</option>
              <option value="APPLIED">Applied</option>
              <option value="OA">OA</option>

              <option value="RECRUITER_SCREEN">
                Recruiter Screen
              </option>

              <option value="INTERVIEW">
                Interview
              </option>

              <option value="FINAL_ROUND">
                Final Round
              </option>

              <option value="OFFER">Offer</option>

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
                setSkillsAligned(event.target.value)
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
                setDateApplied(event.target.value)
              }
              className="w-full rounded border p-2"
            />

            <p className="mt-1 text-sm text-gray-500">
              If status is Applied and this is empty,
              ApplyFlow will automatically use today's date.
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
              placeholder="Recruiter details, interview notes, follow-up information..."
              rows={5}
              className="w-full rounded border p-2"
            />
          </div>

          {/* ERROR */}

          {error && (
            <p className="text-red-600">
              {error}
            </p>
          )}

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            {isSubmitting
              ? "Creating..."
              : "Create Application"}
          </button>

          {/* CANCEL */}

          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="rounded border px-4 py-2"
          >
            Cancel
          </button>
        </form>
      </div>
    </main>
  );
}