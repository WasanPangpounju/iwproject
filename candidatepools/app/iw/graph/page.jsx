"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Loader from "../components/Loader";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

import EmployeeAbilityGraph from "./employeeAbilityGraph";
import UniversityChart from "./employeeUnivercity";

function GraphPage(bgColorNavbar) {
  const router = useRouter();
  const { status, data: session } = useSession();
  const [dataUser, setDataUser] = useState(null);
  const [loader, setLoader] = useState(true);

  // Validate session and fetch user data
  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (!session) {
      router.replace("/");
      return;
    }

    if (session?.user?.id) {
      getUser(session.user.id);
    } else {
      router.replace("/register");
    }
  }, [status, session, router]);
  // Redirect to register if dataUser is empty or null
  useEffect(() => {
    if (dataUser === null) {
      return;
    }

    if (!dataUser || Object.keys(dataUser).length === 0) {
      router.replace("/register");
    }
  }, [dataUser, router, session]);

  // Fetch user data from API
  async function getUser(id) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/user/${id}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      if (!res.ok) {
        throw new Error("Error getting data from API");
      }

      const data = await res.json();
      setDataUser(data.user || {});
    } catch (err) {
      console.error("Error fetching API", err);
    } finally {
      setLoader(false);
    }
  }

  // Manage loader state
  useEffect(() => {
    document.body.classList.toggle("no_scroll", loader);
  }, [loader]);

  const employees = [
    {
      emp: 1,
      name: "John",
      lastName: "Doe",
      university: "University of Chicago",
      type: ["Visually Impaired"],
      ability: ["Communication", "Coding"],
    },
    {
      emp: 2,
      name: "Jane",
      lastName: "Smith",
      university: "Stanford University",
      type: ["Disabled Person"],
      ability: ["Public Speaking", "Management", "Project Management"],
    },
    {
      emp: 3,
      name: "Michael",
      lastName: "Johnson",
      university: "University of Chicago",
      type: ["Disabled Person", "Hearing Impaired"],
      ability: [
        "Problem Solving",
        "Design Thinking",
        "Coding",
        "Project Management",
      ],
    },
    {
      emp: 4,
      name: "Emily",
      lastName: "Williams",
      university: "University of California, Berkeley",
      type: ["Disabled Person"],
      ability: ["Leadership", "Teamwork", "Coding"],
    },
    {
      emp: 5,
      name: "David",
      lastName: "Brown",
      university: "University of Chicago",
      type: ["Disabled Person", "Mobility Impaired"],
      ability: ["Programming", "Analytical Skills"],
    },
    {
      emp: 6,
      name: "Emma",
      lastName: "Davis",
      university: "Cambridge University",
      type: ["Speech Impaired"],
      ability: ["Critical Thinking", "Adaptability"],
    },
    {
      emp: 7,
      name: "James",
      lastName: "Garcia",
      university: "University of Chicago",
      type: ["Disabled Person", "Learning Disabled"],
      ability: ["Creativity", "Attention to Detail", "Analytical Skills"],
    },
    {
      emp: 8,
      name: "Olivia",
      lastName: "Martinez",
      university: "Yale University",
      type: ["Disabled Person"],
      ability: ["Decision Making", "Empathy", "Analytical Skills"],
    },
    {
      emp: 9,
      name: "William",
      lastName: "Anderson",
      university: "Columbia University",
      type: ["Disabled Person", "Mobility Impaired"],
      ability: ["Collaboration", "Project Management"],
    },
    {
      emp: 10,
      name: "Sophia",
      lastName: "Taylor",
      university: "University of Chicago",
      type: ["Disabled Person", "Cognitive Impaired"],
      ability: ["Negotiation", "Time Management"],
    },
  ];

  //   console.log(employees);
  const aggregateAbilities = (employees) => {
    const abilityCount = {};

    employees.forEach((employee) => {
      employee.ability.forEach((ability) => {
        if (abilityCount[ability]) {
          abilityCount[ability]++;
        } else {
          abilityCount[ability] = 1;
        }
      });
    });

    return abilityCount;
  };

  const abilityCount = aggregateAbilities(employees);
  console.log("abilityCount", abilityCount);

  return (
    <>
      <div className={`${bgColorNavbar} rounded-lg p-5`}>
        <p className="text-2xl font-bold">ข่าวประชาสัมพันธ์</p>
        <div className="mt-5 flex justify-between border">
          <h1>Employee Abilities Graph</h1>
          <EmployeeAbilityGraph employees={employees} />
        </div>
        {/* <div className="mt-1 flex justify-between border">
              <h1>Employee Univercity Graph</h1>
              <UniversityChart employees={employees} />
            </div> */}
        <div className="mt-1 flex justify-between border">
          <h1>Employee University Graph</h1>
          <div className="w-[30%]">
            {" "}
            {/* Set the width to 30% */}
            <UniversityChart employees={employees} />
          </div>
        </div>
      </div>
      {loader && (
        <div>
          <Loader />
        </div>
      )}
    </>
  );
}

export default GraphPage;
