export type Topic = "HAMR / Industry" | "Lattice QCD" | "Conformal Algebra" | "Quantum Computing" | "Seminars";

export type Talk = {
  date: string;
  title: string;
  venue: string;
  href?: string;
  topics: Topic[];
};

/**
 * §10.7: "All 21 existing entries preserved verbatim... Add the missing 2026
 * entry at the top." The live site's Selected Talks (5) and Full Talk
 * Archive (21) sections are actually two non-overlapping lists — 26 distinct
 * talks total, not 21. Every one is preserved below rather than dropping any
 * to match the plan's estimate; PLAN.md's "22 research talks" SEO copy
 * (§11) should be corrected to 27 when that page is written.
 *
 * href values with spaces/parens are the real filenames under public/talks/
 * — wrap with encodeURI() at render time, don't rename the files.
 */
export const TALKS: Talk[] = [
  {
    date: "Aug 2026",
    title: "HAMR Modeling & Simulation: The NIMBLE DC-SNR Simulator",
    venue: "[Presented to 50+ senior technologists, subject matter experts, and PhD interns], PhD Expo 2026",
    topics: ["HAMR / Industry"],
  },
  {
    date: "Aug 2026",
    title: "DC-SNR Physics Simulator App and Multiple-Write HAMR Analysis",
    venue: "[Presented to 30+ sputtering engineers, material scientists, test engineers, and R&D engineers], Internal Engineering Review",
    topics: ["HAMR / Industry"],
  },
  {
    date: "Aug 2026",
    title: "Multiple-Write HAMR Analysis and Thermally Activated Switching Processes",
    venue: "[Presented to 30+ R&D engineers and technologists], Internal Engineering Review",
    topics: ["HAMR / Industry"],
  },
  {
    date: "July 2026",
    title: "Analytical Model for Log-Linearity of Write Temperature with Number of Writes",
    venue: "[Presented to 30+ R&D engineers and technologists], Internal Engineering Review",
    topics: ["HAMR / Industry"],
  },
  {
    date: "July 2026",
    title: "HAMR DC-SNR Physics Simulator App",
    venue: "[Presented to 30+ material scientists, test engineers, and subject matter experts], Internal Engineering Review",
    topics: ["HAMR / Industry"],
  },
  {
    date: "July 2026",
    title: "Analytical Model for Log-Linearity of Write Temperature with Number of Writes",
    venue: "[Presented to 30+ R&D engineers and technologists], Cross-Site Engineering Review, WD Japan",
    topics: ["HAMR / Industry"],
  },
  {
    date: "Jun. 03, 2025",
    title: "First Principles Lattice QCD Calculations of nEDMs",
    venue: "T-2 Seminar, Theoretical Division (T-2), Los Alamos National Laboratory, USA",
    href: "/talks/Los_Alamos_T2_talk_First_Principles_Lattice_QCD_Calculations_of_nEDMs__presentation_Hari_NMSU_June_03_2025.pdf",
    topics: ["Lattice QCD", "Seminars"],
  },
  {
    date: "Jun. 07, 2024",
    title: "Lattice QCD calculations of Sivers TMD x dependency",
    venue:
      "2024 CFNS Summer School on the Physics of the Electron-Ion Collider, Center for Frontiers in Nuclear Science, Stony Brook University, NY, USA",
    href: "https://indico.cfnssbu.physics.sunysb.edu/event/111/contributions/1001/attachments/335/552/Lattice_QCD_calculations_of_Sivers_TMD_x_dependance____CFNS_school_presentation_Hari__NMSU_Jun_07_2024.pdf",
    topics: ["Lattice QCD"],
  },
  {
    date: "May 16, 2024",
    title: "Lattice QCD calculations of x dependence of Sivers TMD",
    venue: "T-2 Seminar, Theoretical Division (T-2), Los Alamos National Laboratory, USA",
    href: "/talks/Lattice_QCD_calculations_of_Sivers_TMD_x_dependance____presentation_Hari__NMSU_May_16_2024.pdf",
    topics: ["Lattice QCD", "Seminars"],
  },
  {
    date: "June 15, 2023",
    title: "Lattice QCD calculations of TMDs",
    venue:
      "HUGS Student Seminar Presentation, Thomas Jefferson National Accelerator Facility, Newport News, USA",
    href: "https://indico.jlab.org/event/717/contributions/12720/attachments/9865/14525/Lattice_QCD_calculations_of_TMDs_HUGS_presentation_Hari_NMSU_Jun_15_2023__updated_%20(1).pdf",
    topics: ["Lattice QCD", "Seminars"],
  },
  {
    date: "Dec. 02, 2021",
    title:
      "Interpolating conformal algebra between the instant form and the front form of relativistic dynamics",
    venue: "Light Cone 2021: Physics of Hadrons on the Light Front, Jeju Island, South Korea (online)",
    href: "/talks/Interpolating_conformal_algebra_between_the_instant_form_and_the_front_form_of_relativistic_dynamics__Light_Cone_2021_PRESENTATION__HARI (2).pdf",
    topics: ["Conformal Algebra"],
  },
  {
    date: "Jan. 31, 2025",
    title: "Witt Algebra Interpolation between IFD and LFD",
    venue: "Dr. Chueng-Ryong Ji's research group meeting, North Carolina State University, USA (Online)",
    href: "https://crjiresearchgroup.wordpress.ncsu.edu/files/2025/02/Interpolating-Witt-Algebra.pdf",
    topics: ["Conformal Algebra"],
  },
  {
    date: "May 10, 2024",
    title: "Conformal Algebra",
    venue: "2024 Spring - PHYS-692 - Quantum Field Theory II Final Presentation, New Mexico State University, USA",
    href: "/talks/Conformal_Algebra_QFT2_presentation_Spring_2024.pdf",
    topics: ["Conformal Algebra"],
  },
  {
    date: "May 06, 2024",
    title: "Quantum Circuit Complexity, and AdS/CFT",
    venue:
      "2024 Spring - PHYS-520 - Quantum Computing Final Presentation, New Mexico State University, USA",
    href: "/talks/Complexity_and_AdSCFT__presentation_QC__Hari.pdf",
    topics: ["Quantum Computing"],
  },
  {
    date: "Dec. 01, 2023",
    title: "Lattice QCD calculations of TMDs",
    venue: "Dr. Chueng-Ryong Ji's research group meeting, North Carolina State University, USA (Online)",
    href: "https://crjiresearchgroup.wordpress.ncsu.edu/files/2023/12/Lattice_QCD_calculations_of_x_dependent_TMDs_Hari_presentation_for_Dr_Ji_group_meeting_Dec_01_2023.pdf",
    topics: ["Lattice QCD"],
  },
  {
    date: "Nov. 09, 2023",
    title: "Lattice QCD calculations of Transverse Momentum Dependent Parton Distribution Functions (TMDs)",
    venue: "PhD Comprehensive Oral Exam, New Mexico State University, USA",
    href: "/talks/Lattice_QCD_calculations_of_TMDs_Comprehensive_exam_presentation_Hari_NMSU_Nov_9_2023 (9).pdf",
    topics: ["Lattice QCD", "Seminars"],
  },
  {
    date: "Oct. 20, 2023",
    title: "Interpolating Manifestly Covariant Conformal Algebra in \\(d=1+1\\) between IFD and LFD",
    venue: "Dr. Chueng-Ryong Ji's research group meeting, North Carolina State University, USA (Online)",
    href: "/talks/Interpolating_Manifestly_Covariant_Conformal_Algebra__1_1__between_IFD_and_LFD__Hari_presentation__Oct_20_2023_Dr_Ji_group_meeting_NCSU (4).pdf",
    topics: ["Conformal Algebra"],
  },
  {
    date: "Oct. 28, 2022",
    title: "More on conformal symmetry",
    venue: "Dr. Chueng-Ryong Ji's research group meeting, North Carolina State University, USA (Online)",
    href: "/talks/More_on_conformal_symmetry___Hari_presentation_Oct_28_2022___Dr__Ji_meeting_ (2).pdf",
    topics: ["Conformal Algebra"],
  },
  {
    date: "Sept. 16, 2022",
    title: "It Is All About The Rotations - But In 6 Dimensions",
    venue: "Dr. Chueng-Ryong Ji's research group meeting, North Carolina State University, USA (Online)",
    href: "https://crjiresearchgroup.wordpress.ncsu.edu/files/2022/09/Its_all_about_rotation_but_in_6_dimensions___Hari_presentation_Sep_16_2022___Dr__Ji_meeting_.pdf",
    topics: ["Conformal Algebra"],
  },
  {
    date: "July 15, 2022",
    title: "Isomorphism Between Conformal Algebra & Dirac Matrices",
    venue: "Dr. Chueng-Ryong Ji's research group meeting, North Carolina State University, USA (Online)",
    href: "https://crjiresearchgroup.wordpress.ncsu.edu/files/2022/09/Isomorphism_between_conformal_algebra_and_Dirac_matrices__Hari_presentation_July_15_2022___Dr__Ji_meeting_-3.pdf",
    topics: ["Conformal Algebra"],
  },
  {
    date: "June 10, 2022",
    title: "Dirac's Conformal Space \\(d=6\\)",
    venue: "Dr. Chueng-Ryong Ji's research group meeting, North Carolina State University, USA (Online)",
    href: "https://crjiresearchgroup.wordpress.ncsu.edu/files/2022/09/Dirac_s_Conformal_Space_4d__Hari_presentation_Jun_10_2022___Dr__Ji_meeting_-3.pdf",
    topics: ["Conformal Algebra"],
  },
  {
    date: "Apr. 15, 2022",
    title: "Interpolating the conformal algebra in ultra simpler form and it's representations",
    venue: "Dr. Chueng-Ryong Ji's research group meeting, North Carolina State University, USA (Online)",
    href: "https://crjiresearchgroup.wordpress.ncsu.edu/files/2022/04/Interpolating_the_conformal_algebra_in_ultra_simpler_form_and_representations__Hari_presentation_April_15_2022___Dr__Ji_meeting___Copy_.pdf",
    topics: ["Conformal Algebra"],
  },
  {
    date: "Mar. 11, 2022",
    title: "Interpolating the Conformal Algebra in Ultra Simpler Form",
    venue: "Dr. Chueng-Ryong Ji's research group meeting, North Carolina State University, USA (Online)",
    href: "https://crjiresearchgroup.wordpress.ncsu.edu/files/2022/03/Interpolating_the_conformal_algebra_in_ultra_simpler_form__Hari_presentation_March_11_2022___Dr__Ji_meeting_-2.pdf",
    topics: ["Conformal Algebra"],
  },
  {
    date: "Feb. 04, 2022",
    title: "Conformal-Poincare group algebra structure in the interpolating dynamics",
    venue: "Dr. Chueng-Ryong Ji's research group meeting, North Carolina State University, USA (Online)",
    href: "https://crjiresearchgroup.wordpress.ncsu.edu/files/2022/02/Conformal_Poincare_group_algebra_structure_in_the_interpolating_dynamics__Hari_presentation_Feb_04_2022___Dr__Ji_meeting_.pdf",
    topics: ["Conformal Algebra"],
  },
  {
    date: "Sept. 24, 2021",
    title: "Momentum operator components' transformation under SCT",
    venue: "Dr. Chueng-Ryong Ji's research group meeting, North Carolina State University, USA (Online)",
    href: "https://crjiresearchgroup.wordpress.ncsu.edu/files/2021/09/Momentum_operator_components__transformation_under_SCT__Sep_24__2021__.pdf",
    topics: ["Conformal Algebra"],
  },
  {
    date: "Sept. 2021",
    title: "The Poincaré Algebra Interpolation",
    venue: "MSc thesis defense, National Institute of Technology Jalandhar, India (online)",
    href: "/talks/The_Poincaré_Algebra_Interpolation__Dissertations_External_presentation_.pdf",
    topics: ["Conformal Algebra", "Seminars"],
  },
  {
    date: "June 18, 2021",
    title: "Interpolating the conformal algebra",
    venue: "Dr. Chueng-Ryong Ji's research group meeting, North Carolina State University, USA (Online)",
    href: "https://crjiresearchgroup.wordpress.ncsu.edu/files/2021/06/Conformal_Algebra_Interpolation__Hari_presentation_June_18_2021_.pdf",
    topics: ["Conformal Algebra"],
  },
  {
    date: "Mar. 19, 2021",
    title: "Hartree-type Approximation for \\((\\phi^4)_{1+1}\\)",
    venue: "Dr. Chueng-Ryong Ji's research group meeting, North Carolina State University, USA (Online)",
    href: "https://crjiresearchgroup.wordpress.ncsu.edu/files/2021/09/Hartree_type_Approximation__Hari_s_presentation_Mar_19_2021_-1.pdf",
    topics: ["Seminars"],
  },
  {
    date: "Jan. 29, 2021",
    title: "Dirac Equation",
    venue: "Particle physics student seminar, National Institute of Technology Jalandhar, India",
    href: "https://docs.google.com/presentation/d/1FOrx6SwsWon0yhhJp-Kk1_G7JwAgeXpQhGFfZL1aVMw/edit?usp=sharing",
    topics: ["Seminars"],
  },
  {
    date: "Dec. 18, 2020",
    title: "Interpolating sine-Gordon Model in \\(d=1+1\\)",
    venue: "Dr. Chueng-Ryong Ji's research group meeting, North Carolina State University, USA (Online)",
    href: "https://crjiresearchgroup.wordpress.ncsu.edu/files/2021/09/Interpolating_sine_Gordon_model_Presentation_Dec_18__2020.pdf",
    topics: ["Seminars"],
  },
  {
    date: "Feb. 20, 2020",
    title: "Understanding the action \\(S\\) in physics",
    venue: "Student Lecture Series, National Institute of Technology Jalandhar, India",
    href: "https://docs.google.com/presentation/d/1DcYwTamSoeGneBbUQR24vKjVDNJSXU0EboeBsfSu_io/edit?usp=sharing",
    topics: ["Seminars"],
  },
  {
    date: "Aug. 26, 2019",
    title: "Richard Feynman's life in Particle Physics",
    venue: "Student Colloquium, National Institute of Technology Jalandhar, India",
    href: "https://docs.google.com/presentation/d/1NmrggMMDo_SPh8GSMpRXUli_yxrLOAI0/edit?usp=sharing&ouid=107668469406462111882&rtpof=true&sd=true",
    topics: ["Seminars"],
  },
];
