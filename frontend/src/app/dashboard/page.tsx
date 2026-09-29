"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
  location: string | null;
  date_applied: string | null;
};

export default function DashboardPage() {
  const router = useRouter();

  const [applications, setApplications] =
    useState<Application[]>([]);

  // Filter state
  const [statusFilter, setStatusFilter] =
    useState<ApplicationStatus | "">("");

  const [platformFilter, setPlatformFilter] =
    useState<ApplicationPlatform | "">("");

  const [isLoading, setIsLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ============================================
  // FETCH APPLICATIONS
  // ============================================

  useEffect(() => {
    const storedToken =
      localStorage.getItem("access_token");

    if (!storedToken) {
      router.push("/login");
      return;
    }

    async function fetchApplications() {
      setIsLoading(true);
      setError("");

      // Start with normal endpoint
      let url =
        "http://localhost:8000/applications";

      // Build query parameters
      const queryParams =
        new URLSearchParams();

      if (statusFilter) {
        queryParams.append(
          "status",
          statusFilter
        );
      }

      if (platformFilter) {
        queryParams.append(
          "platform",
          platformFilter
        );
      }

      // Example:
      // status=APPLIED&platform=LINKEDIN

      const queryString =
        queryParams.toString();

      if (queryString) {
        url = `${url}?${queryString}`;
      }

      try {
        const response = await fetch(url, {
          method: "GET",

          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem(
              "access_token"
            );

            router.push("/login");
            return;
          }

          console.log(
            "Failed to fetch applications:",
            data
          );

          setError(
            "Failed to load applications."
          );

          return;
        }

        setApplications(data);
      } catch (error) {
        console.log(
          "Fetch applications error:",
          error
        );

        setError(
          "Could not connect to the server."
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchApplications();
  }, [statusFilter, platformFilter, router]);

  // ============================================
  // LOGOUT
  // ============================================

  function handleLogout() {
    localStorage.removeItem(
      "access_token"
    );

    router.push("/login");
  }

  // ============================================
  // CLEAR FILTERS
  // ============================================

  function clearFilters() {
    setStatusFilter("");
    setPlatformFilter("");
  }

  // ============================================
  // PAGE
  // ============================================

  return (
    <main className="min-h-screen bg-white p-10 text-black">
      <div className="mx-auto max-w-4xl">

        {/* HEADER */}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              ApplyFlow
            </h1>

            <p className="mt-1 text-gray-600">
              Job Application Dashboard
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded border px-4 py-2"
          >
            Logout
          </button>
        </div>

        {/* ADD APPLICATION */}

        <div className="mt-8">
          <Link
            href="/applications/new"
            className="inline-block rounded bg-black px-4 py-2 text-white"
          >
            Add Application
          </Link>
        </div>

        {/* FILTERS */}

        <div className="mt-8 border p-4">
          <h2 className="text-xl font-semibold">
            Filters
          </h2>

          <div className="mt-4 flex flex-wrap gap-4">

            {/* STATUS FILTER */}

            <div>
              <label
                htmlFor="statusFilter"
                className="mb-1 block"
              >
                Status
              </label>

              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as
                      | ApplicationStatus
                      | ""
                  )
                }
                className="border p-2"
              >
                <option value="">
                  All Statuses
                </option>

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

            {/* PLATFORM FILTER */}

            <div>
              <label
                htmlFor="platformFilter"
                className="mb-1 block"
              >
                Platform
              </label>

              <select
                id="platformFilter"
                value={platformFilter}
                onChange={(event) =>
                  setPlatformFilter(
                    event.target.value as
                      | ApplicationPlatform
                      | ""
                  )
                }
                className="border p-2"
              >
                <option value="">
                  All Platforms
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

            {/* CLEAR FILTERS */}

            <div className="flex items-end">
              <button
                type="button"
                onClick={clearFilters}
                className="border px-4 py-2"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* APPLICATION COUNT */}

        <p className="mt-6">
          Applications:{" "}
          {applications.length}
        </p>

        {/* ERROR */}

        {error && (
          <p className="mt-4 text-red-600">
            {error}
          </p>
        )}

        {/* LOADING */}

        {isLoading ? (
          <p className="mt-6">
            Loading applications...
          </p>
        ) : applications.length === 0 ? (
          <p className="mt-6">
            No applications found.
          </p>
        ) : (
          <div className="mt-6 space-y-4">

            {/* APPLICATION LIST */}

            {applications.map(
              (application) => (
                <div
                  key={application.id}
                  className="rounded border p-4"
                >
                  <h2 className="text-xl font-semibold">
                    {application.company}
                  </h2>

                  <p className="mt-1">
                    {application.role}
                  </p>

                  <p className="mt-2">
                    Status:{" "}
                    {application.status}
                  </p>

                  <p>
                    Platform:{" "}
                    {application.platform ??
                      "Not specified"}
                  </p>

                  <p>
                    Location:{" "}
                    {application.location ??
                      "Not specified"}
                  </p>

                  <p>
                    Date Applied:{" "}
                    {application.date_applied ??
                      "Not applied yet"}
                  </p>

                  <Link
                    href={`/applications/${application.id}`}
                    className="mt-3 inline-block text-blue-600"
                  >
                    View Application
                  </Link>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </main>
  );
}