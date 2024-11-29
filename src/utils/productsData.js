let productsData = [
    {
        id: 1,
        name: "React for Beginners",
        type: "Course",
        price: "3199",
        details: "Learn React from scratch with hands-on projects.",
        coverImage: "https://images.unsplash.com/photo-1687603917313-ccae1a289a9d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        enrolledStudents: 250,
        completedStudents: 180,
        inProgressStudents: 50,
        certificatesClaimed: 170,
        revenue: 799750,
        lessons: [
          { id: 1, title: "Introduction to React", duration: "45 min", videoLink:"" },
          { id: 2, title: "Components and Props", duration: "60 min", videoLink:""  },
          { id: 3, title: "State and Lifecycle", duration: "50 min", videoLink:""  }
        ]
    },
    {
        id: 2,
        name: "Advanced JavaScript",
        type: "Course",
        price: "4599",
        details: "Deep dive into JavaScript concepts and advanced topics.",
        coverImage: "",
        enrolledStudents: 120,
        completedStudents: 80,
        inProgressStudents: 30,
        certificatesClaimed: 70,
        revenue: 551880,
        lessons: [
            { id: 1, title: "ES6 Features", duration: "40 min", videoLink:""  },
            { id: 2, title: "Asynchronous JavaScript", duration: "55 min", videoLink:""  },
            { id: 3, title: "Advanced Array Methods", duration: "50 min", videoLink:""  }
        ]
    },
    {
        id: 3,
        name: "Python Basics",
        type: "Course",
        price: "2999",
        details: "An introductory course for Python programming.",
        coverImage: "",
        enrolledStudents: 300,
        completedStudents: 230,
        inProgressStudents: 50,
        certificatesClaimed: 220,
        revenue: 899700,
        lessons: [
            { id: 1, title: "Introduction to Python", duration: "50 min", videoLink:""  },
            { id: 2, title: "Data Types and Variables", duration: "45 min", videoLink:""  }
        ]
    },
    {
        id: 4,
        name: "Data Science Webinar",
        type: "Webinar",
        price: "Free",
        details: "A one-hour session on the basics of Data Science.",
        coverImage: "",
        registeredStudents: 500,
        registrationOpen : true,
        revenue: 0 // No revenue for free webinars
    },
    {
        id: 5,
        name: "1-on-1 Java Tutoring",
        type: "Tutoring",
        price: "250",
        details: "Personalized tutoring session for Java programming.",
        coverImage: "",
        revenue: 1150,
        sessionsBooked: 5,
        upcomingSessions: [
            { studentName: "Alice Johnson", Date: "2024-11-25", Time: "10:00 AM", status: "Confirmation Pending" },
            { studentName: "Bob Smith", Date: "2024-11-26", Time: "2:00 PM", status: "Approved" },
            { studentName: "Charlie Brown", Date: "2024-11-27", Time: "5:00 PM", status: "Rescheduled" }
        ],
        completedSessions: [
            { studentName: "Diana Prince", Date: "2024-11-15", Time: "3:00 PM", status: "Completed" },
            { studentName: "Edward Green", Date: "2024-11-20", Time: "1:00 PM", status: "Completed" }
        ]
    },
    {
        id: 6,
        name: "UI/UX Design Workshop",
        type: "Workshop",
        price: "1999",
        details: "Hands-on workshop to learn UI/UX design.",
        coverImage: "",
        enrolledStudents: 100,
        revenue: 199900
    },
    {
        id: 7,
        name: "Live Webinar: DevOps Basics",
        type: "Webinar",
        price: "319",
        details: "Understanding the core concepts of DevOps.",
        coverImage: "",
        registeredStudents: 150,
        registrationOpen : false,
        revenue: 47850
    },
    {
        id: 8,
        name: "Full-Stack Development",
        type: "Course",
        price: "8999",
        details: "Learn to build end-to-end web applications.",
        coverImage: "",
        enrolledStudents: 200,
        completedStudents: 150,
        inProgressStudents: 50,
        certificatesClaimed: 140,
        revenue: 1799800,
        lessons: [
            { id: 1, title: "Introduction to Full-Stack Development", duration: "50 min", videoLink:""  },
            { id: 2, title: "Backend Development", duration: "70 min", videoLink:""  },
            { id: 3, title: "Frontend Development", duration: "60 min", videoLink:""  }
        ]
    },
    {
        id: 9,
        name: "Intro to Cybersecurity",
        type: "Course",
        price: "2999",
        details: "Get started with cybersecurity fundamentals.",
        coverImage: "",
        enrolledStudents: 180,
        completedStudents: 140,
        inProgressStudents: 30,
        certificatesClaimed: 120,
        revenue: 539820,
        lessons: [
            { id: 1, title: "Basics of Cybersecurity", duration: "45 min", videoLink:""  },
            { id: 2, title: "Network Security", duration: "60 min", videoLink:""  }
        ]
    },
    { 
        id: 10, 
        name: "JavaScript Interview Prep", 
        type: "Tutoring", 
        price: "300", 
        details: "Mock interviews and tips for JavaScript roles." ,
        coverImage: "",
        revenue: 1500,
        sessionsBooked: 5,
        upcomingSessions: [
            { studentName: "Fiona White", Date: "2024-11-28", Time: "11:00 AM", status: "Confirmation Pending" },
            { studentName: "George Black", Date: "2024-11-29", Time: "4:00 PM", status: "Approved" }
        ],
        completedSessions: [
            { studentName: "Hannah Gray", Date: "2024-11-10", Time: "9:00 AM", status: "Completed" },
            { studentName: "Ian Blue", Date: "2024-11-12", Time: "2:00 PM", status: "Completed" }
        ]
    },
    { 
        id: 11, 
        name: "Machine Learning Basics", 
        type: "Course", 
        price: "1999", 
        details: "A beginner-friendly course on Machine Learning.", 
        coverImage: "", 
        enrolledStudents: 500, 
        completedStudents: 350, 
        inProgressStudents: 100, 
        certificatesClaimed: 300, 
        revenue: 999500, 
        lessons: [
            { id: 1, title: "Introduction to Machine Learning", duration: "45 min", videoLink:""  },
            { id: 2, title: "Supervised Learning", duration: "60 min", videoLink:""  },
            { id: 3, title: "Unsupervised Learning", duration: "50 min", videoLink:""  }
        ]
    },
    { 
        id: 12, 
        name: "Live Coding Webinar: Python", 
        type: "Webinar", 
        price: "Free", 
        details: "A live coding session for Python beginners.", 
        coverImage: "",
        registeredStudents: 350, 
        registrationOpen : false,
        revenue: 0 
    },
    { 
        id: 13, 
        name: "Cloud Computing 101", 
        type: "Course", 
        price: "8999", 
        details: "Learn cloud computing with hands-on examples.", 
        coverImage: "",
        enrolledStudents: 220, 
        completedStudents: 180, 
        inProgressStudents: 40, 
        certificatesClaimed: 170, 
        revenue: 1979780, 
        lessons: [
            { id: 1, title: "Introduction to Cloud Computing", duration: "50 min", videoLink:""  },
            { id: 2, title: "AWS Basics", duration: "65 min", videoLink:""  },
            { id: 3, title: "Azure Fundamentals", duration: "55 min", videoLink:""  }
        ]
    },
    { 
        id: 14, 
        name: "Digital Marketing Workshop", 
        type: "Workshop", 
        price: "999", 
        details: "A practical guide to digital marketing strategies.", 
        coverImage: "",
        enrolledStudents: 120, 
        revenue: 119880 
    },
    { 
        id: 15, 
        name: "Full-Day Java Bootcamp", 
        type: "Workshop", 
        price: "499", 
        details: "An intensive Java programming bootcamp.", 
        coverImage: "", 
        enrolledStudents: 80, 
        revenue: 39920 
    },
    { 
        id: 16, 
        name: "Blockchain Basics", 
        type: "Course", 
        price: "599", 
        details: "An introduction to blockchain and cryptocurrencies.", 
        coverImage: "",
        enrolledStudents: 150, 
        completedStudents: 110, 
        inProgressStudents: 30, 
        certificatesClaimed: 100, 
        revenue: 89850, 
        lessons: [
            { id: 1, title: "Introduction to Blockchain", duration: "45 min", videoLink:""  },
            { id: 2, title: "Smart Contracts", duration: "60 min", videoLink:""  }
        ]
    },
    { 
        id: 17, 
        name: "Kubernetes Masterclass", 
        type: "Course", 
        price: "799", 
        details: "Master Kubernetes with real-world examples.", 
        coverImage: "",
        enrolledStudents: 180, 
        completedStudents: 140, 
        inProgressStudents: 30, 
        certificatesClaimed: 130, 
        revenue: 143820, 
        lessons: [
            { id: 1, title: "Introduction to Kubernetes", duration: "50 min", videoLink:""  },
            { id: 2, title: "Pods and Services", duration: "60 min", videoLink:""  },
            { id: 2, title: "Pods and Services", duration: "60 min", videoLink:""  },
            { id: 3, title: "Deploying Applications on Kubernetes", duration: "70 min", videoLink:""  }
        ]
    },
    { 
        id: 18, 
        name: "React Advanced Patterns", 
        type: "Course", 
        price: "5999", 
        details: "Learn advanced React patterns and techniques.", 
        coverImage: "",
        enrolledStudents: 220, 
        completedStudents: 180, 
        inProgressStudents: 40, 
        certificatesClaimed: 160, 
        revenue: 1319780, 
        lessons: [
            { id: 1, title: "Context API and Hooks", duration: "55 min", videoLink:""  },
            { id: 2, title: "React Router and State Management", duration: "65 min", videoLink:""  },
            { id: 3, title: "Optimizing React Applications", duration: "70 min", videoLink:""  }
        ]
    },
    { 
        id: 19, 
        name: "APIs and Microservices", 
        type: "Course", 
        price: "2999", 
        details: "Understand and build APIs and microservices.", 
        coverImage: "",
        enrolledStudents: 150, 
        completedStudents: 120, 
        inProgressStudents: 20, 
        certificatesClaimed: 110, 
        revenue: 449850, 
        lessons: [
            { id: 1, title: "Introduction to RESTful APIs", duration: "50 min", videoLink:""  },
            { id: 2, title: "Building Microservices with Node.js", duration: "60 min", videoLink:""  }
        ]
    },
    { 
        id: 20, 
        name: "Intro to Data Visualization", 
        type: "Course", 
        price: "1999", 
        details: "Visualize data effectively using modern tools.", 
        coverImage: "",
        enrolledStudents: 190, 
        completedStudents: 150, 
        inProgressStudents: 30, 
        certificatesClaimed: 140, 
        revenue: 379810, 
        lessons: [
            { id: 1, title: "Introduction to Data Visualization", duration: "40 min", videoLink:""  },
            { id: 2, title: "Using Tools like Tableau and Power BI", duration: "55 min", videoLink:""  },
            { id: 3, title: "Creating Interactive Dashboards", duration: "65 min", videoLink:""  }
        ]
    }
 ]

 export default productsData;