"use client"

import React, { useState, useEffect } from 'react'
import NavbarLogo from '@/app/components/NavbarLogo'
import NavbarSupervisor from '@/app/supervisor/components/NavbarSupervisor'
import Image from 'next/image'
import Loader from '@/app/components/Loader'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/app/ThemeContext'
import Icon from '@mdi/react'
import { mdiFileDocument, mdiMicrosoftExcel, mdiMagnify, mdiArrowDownDropCircle, mdiPlus, mdiContentSave, mdiCloseThick } from '@mdi/js'
import dataWorkType from '@/app/interestedwork/dataWorkType'
import Link from 'next/link'
import EditUser from '@/app/supervisor/usermanagement/components/EditUser'
import AddUser from '@/app/supervisor/usermanagement/components/AddUser'

//table
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';


const columns = [
    {
        id: 'name',
        label: 'ลำดับ',
        minWidth: 170
    },
    {
        id: 'university',
        label: 'สถาบันการศึกษา',
        minWidth: 170,
    },
    {
        id: 'level',
        label: 'จำนวนนักศึกษา',
        minWidth: 170,
    },
    {
        id: 'disabled',
        label: 'จำนวนบัณฑิตพิการ',
        minWidth: 170,
    },
    {
        id: 'details',
        label: 'ทั้งหมด',
        minWidth: 170,
        align: "center",
    },
];

function ReportAllStudent() {
    const [loader, setLoader] = useState(false)

    const router = useRouter();
    const { status, data: session } = useSession();
    const [dataUser, setDataUser] = useState([])

    // Validate session and fetch user data
    useEffect(() => {
        if (status === "loading") {
            return;
        }
        setLoader(false);

        if (!session) {
            router.replace("/");
            return;
        }

        if (session?.user?.id) {
            getUser(session.user.id);
            getDataStudent();
            getDataEducation();
            getDataWorks();
        } else {
            router.replace("/agreement");
        }

        if (session?.user?.role === "user") {
            router.replace("/main");
        } else if (session?.user?.role === "admin") {
            router.replace("/admin");
        }

    }, [status, session, router]);

    //get data from user
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

    //Theme
    const {
        setFontSize,
        setBgColor,
        setBgColorNavbar,
        setBgColorWhite,
        setBgColorMain,
        setBgColorMain2,
        fontSize,
        bgColorNavbar,
        bgColor,
        bgColorWhite,
        bgColorMain,
        bgColorMain2,
        setLineBlack,
        lineBlack,
        setTextBlue,
        textBlue,
        setRegisterColor,
        registerColor,
        inputEditColor,
        inputGrayColor,
    } = useTheme();

    //getDatastudent
    const [studentData, setStudentData] = useState([]);
    const [loaderTable, setLoaderTable] = useState(true);
    async function getDataStudent() {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/students`,
                {
                    method: "GET",
                    cache: "no-store",
                }
            );

            if (!res.ok) {
                throw new Error("Error getting data from API");
            }

            const data = await res.json();
            setStudentData(data.user || {});
        } catch (err) {
            console.error("Error fetching API", err);
        } finally {
            setLoaderTable(false);
        }
    }

    //get Education
    const [dataEducations, setDataEducations] = useState(null)
    async function getDataEducation(id) {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/educations`, {
                method: "GET",
                cache: "no-store"
            });

            if (!res.ok) {
                throw new Error("Error getting data from API");
            }

            const data = await res.json();
            setDataEducations(data.educations || {});

        } catch (err) {
            console.error("Error fetching API", err);
        }
    }

    //getData work
    const [dataWorks, setDataWorks] = useState([]);
    async function getDataWorks() {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/interestedwork`, {
                method: "GET",
                cache: "no-store"
            });

            if (!res.ok) {
                throw new Error("Error getting data from API");
            }

            const data = await res.json();
            setDataWorks(data.interestedWork || {});

        } catch (err) {
            console.error("Error fetching API", err);
        }
    }

    //table
    function createData(name, university, level, disabled, details, uuid) {
        return { name, university, level, disabled, details, uuid };
    }

    //type search
    const [wordSearch, setWordSearch] = useState('')
    const [typePersonSearch, setTypePersonSearch] = useState('')

    //handle search filter
    const [wordSearchFilter, setWordSearchFilter] = useState([])

    function handleSearch(e) {
        e.preventDefault();

        if (wordSearch) {
            setWordSearchFilter(() => {
                setWordSearch('');
                return [wordSearch]; // แทนที่คำค้นหาใหม่
            });
        }
    }
    function deleteWordSearch(index) {
        setWordSearchFilter((prev) => {
            // ใช้ filter เพื่อลบคำที่ตรงกับ index
            return prev.filter((_, i) => i !== index);
        });
    }

    //setyear
    const today = new Date();
    const yearToday = today.getFullYear();
    // สร้างลิสต์ปีจากปีปัจจุบันย้อนหลัง 100 ปี
    const years = Array.from({ length: 101 }, (_, i) => yearToday - i);

    let universityCheckYear = [];
    let count = 0;
    const rows = studentData?.map((std) => {
        if (std?.role !== "user" || std?.uuid === session?.user?.id) {
            return null;
        }

        const dateCreate = std?.createdAt;
        const yearCreate = dateCreate.split('-')[0];
        const education = dataEducations?.find(edu => edu?.uuid === std?.uuid);

        if (!education?.university) return null;

        // ตรวจสอบว่ามี `yearCreate` หรือไม่ก่อนเพิ่มข้อมูล
        let yearData = universityCheckYear.find((item) => item.year === yearCreate);

        if (!yearData) {
            yearData = {
                year: yearCreate,
                data: []
            };
            universityCheckYear.push(yearData);
        }

        let allData = universityCheckYear.find((item) => item.year === "all");
        if (!allData) {
            allData = {
                year: "all",
                data: []
            };
            universityCheckYear.push(allData);
        }

        education.university.forEach((uni) => {
            const existingUniversity = yearData.data.find((item) => item.university === uni);
            if (existingUniversity) {
                // เพิ่มจำนวนตาม typePerson
                if (education?.typePerson === "นักศึกษาพิการ") {
                    existingUniversity.student += 1;
                } else if (education?.typePerson === "บัณฑิตพิการ") {
                    existingUniversity.graduation += 1;
                }
            } else {
                // เพิ่มข้อมูลใหม่ใน universityCheck
                yearData.data.push({
                    university: uni,
                    student: education?.typePerson === "นักศึกษาพิการ" ? 1 : 0,
                    graduation: education?.typePerson === "บัณฑิตพิการ" ? 1 : 0
                });
            }
            // เพิ่มข้อมูลเข้าที่ year: "all" เพื่อรวมทุกอย่างไว้
            const existingAllData = allData.data.find((item) => item.university === uni);
            if (existingAllData) {
                if (education?.typePerson === "นักศึกษาพิการ") {
                    existingAllData.student += 1;
                } else if (education?.typePerson === "บัณฑิตพิการ") {
                    existingAllData.graduation += 1;
                }
            } else {
                allData.data.push({
                    university: uni,
                    student: education?.typePerson === "นักศึกษาพิการ" ? 1 : 0,
                    graduation: education?.typePerson === "บัณฑิตพิการ" ? 1 : 0
                });
            }
        });

        return null;
    });

    // **สร้าง rows จาก universityCheck**
    let showData = []
    const setYearData = universityCheckYear.map((uni, index) => {
        // ตรวจสอบว่ามีคำใน tempWordSearch ตรงกับ uni หรือไม่'
        let tempShowData = []
        if (typePersonSearch) {
            if (uni?.year.includes(typePersonSearch)) {
                showData = uni?.data
            }
        } else {
            if (uni?.year.includes("all")) {
                showData = uni?.data
            }

        }

    });

    const resultRows = showData.map((uni, index) => {
        const tempWordSearch = wordSearchFilter?.length === 0 ? [wordSearch] : wordSearchFilter
        const hasMatchUniversityFilter = tempWordSearch?.some(word =>
            uni?.university?.toLowerCase().includes(word.toLowerCase())
        );
        const tempWordUniversity = uni?.university?.toLowerCase().includes(wordSearch.toLowerCase());

        if (!wordSearch) {
            if (!hasMatchUniversityFilter) {
                return null;
            }
        } else if (!tempWordUniversity) {
            return null;
        }

        count++;
        return createData(
            `${count}`,
            `${uni?.university}`,
            `${uni?.student}`,
            `${uni?.graduation}`,
            `${uni?.student + uni?.graduation}`,
            `s`
        );
    }).filter(row => row !== null)

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    //show detail 
    const [idDetail, setIdDetail] = useState('')

    //show addUser
    const [addUser, setAddUser] = useState(false);

    //edit menu open
    const [isEditMenuOpen, setIsEditMenuOpen] = useState(false);

    const handleMenuOpen = () => {
        setIsEditMenuOpen(true); // เปิดเมนู
    };

    const handleMenuClose = () => {
        setIsEditMenuOpen(false); // ปิดเมนู
    };

    //resume menu open
    const [isResumeMenuOpen, setIsResumeMenuOpen] = useState(false);

    const handleResumeMenuOpen = () => {
        setIsResumeMenuOpen(true); // เปิดเมนู
    };

    const handleResumeMenuClose = () => {
        setIsResumeMenuOpen(false); // ปิดเมนู
    };
    return (

        <>
            <div className='mt-10 flex flex-col gap-1 font-bold'>
                <div className='flex justify-between items-end'>
                    <p>รายงานจำนวนนักศึกษาทั้งหมด จำแนกตามมหาวิทยาลัย</p>
                    <div className='relative group'>
                        <div className={`bg-gray-300 px-4 py-2  cursor-pointer`}>
                            Download Dataset
                        </div>
                        <div className={`hidden group-hover:block  ${bgColorMain2} shadow absolute top-[100%] right-0 z-10 w-56`}>
                            <div className='hover:bg-gray-300 relative px-4 py-2 cursor-pointer flex gap-5  items-center'>
                                <Icon className={`cursor-pointer text-gray-400 `} path={mdiFileDocument} size={.7} />
                                <p className=''>
                                    Download as CSV File
                                </p>
                            </div>
                            <div className='hover:bg-gray-300 relative px-4 py-2 cursor-pointer flex gap-5 items-center'>
                                <Icon className={`cursor-pointer text-gray-400 `} path={mdiMicrosoftExcel} size={.7} />
                                <p className=''>
                                    Download as Excel File
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <hr className={` mb-3 border-gray-500`} />
            </div>
            <form onSubmit={(e) => handleSearch(e)} className=' mb-7 flex justify-between flex-wrap gap-y-5 items-end'>
                <div className='flex gap-5 gap-y-3 flex-wrap'>
                    <div className='flex flex-col gap-1'>
                        <label>คำค้นหา</label>
                        <input
                            value={wordSearch}
                            type="text"
                            className={`${bgColorMain} w-56 border border-gray-400 py-1 px-4 rounded-md`}
                            placeholder='มหาวิทยาลัย'
                            onChange={(e) => setWordSearch(e.target.value)}
                        />
                    </div>

                    <div className='flex flex-col gap-1'>
                        <label >เลือกช่วงเวลา</label>
                        <div className="relative col w-fit">
                            <select
                                className={`${bgColorMain} cursor-pointer whitespace-nowrap text-ellipsis overflow-hidden w-40 border border-gray-400 py-1 px-4 rounded-lg`}
                                style={{ appearance: 'none' }}
                                onChange={(e) => setTypePersonSearch(e.target.value)}
                            >
                                <option value="">ทั้งหมด</option>
                                {years?.map((year, index) => (
                                    <option key={index} value={year}>ปี {year}</option>
                                ))}
                            </select>
                            <Icon className={`cursor-pointer text-gray-400 absolute right-0 top-[8px] mx-3`} path={mdiArrowDownDropCircle} size={.5} />
                        </div>
                    </div>
                    <div className="flex items-end">
                        <button type="submit"
                            className={` ${bgColorWhite} ${inputGrayColor === "bg-[#74c7c2]" || "" ? "bg-[#0d96f8]" : ""}  hover:cursor-pointer py-1 px-6  rounded-2xl flex justify-center items-center gap-1 border border-white`}
                        >
                            <Icon path={mdiMagnify} size={1} />
                            <p>ค้นหา</p>
                        </button>
                    </div>
                </div>

            </form>
            {wordSearchFilter?.length > 0 && (
                <div className='mt-5 flex gap-2 flex-wrap'>
                    {wordSearchFilter?.map((word, index) => (
                        <div key={index}
                            className={`${bgColorWhite} ${inputGrayColor === "bg-[#74c7c2]" || "" ? `${index % 2 !== 0 ? "bg-gray-400" : index % 2 === 0 ? "bg-orange-400" : ""}` : "border border-white"}
                                                px-8 py-1 rounded-lg relative cursor-pointer`}
                            onClick={() => deleteWordSearch(index)}
                        >
                            {word}
                            <Icon className={` cursor-pointer text-white-400 absolute right-0 top-[8px] mx-3`} path={mdiCloseThick} size={.5} />

                        </div>
                    ))}
                </div>
            )}
            {loaderTable ? (
                <div className='py-2'>กำลังโหลดข้อมูล...</div>
            ) : (
                studentData?.length > 1 ? (
                    <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: 'none' }}>
                        <TableContainer sx={{ maxHeight: 700 }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                align={column.align}
                                                style={{ minWidth: column.minWidth }}
                                            >
                                                {column.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {resultRows
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row, index) => {
                                            return (
                                                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                                                    {columns.map((column) => {
                                                        const value = row[column.id];
                                                        return (
                                                            <TableCell key={column.id} align={column.align}>
                                                                {column.format && typeof value === 'number'
                                                                    ? column.format(value)
                                                                    : value}
                                                            </TableCell>
                                                        );
                                                    })}
                                                </TableRow>
                                            )

                                        })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            component="div"
                            count={rows.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                ) : (
                    <div>ไม่มีข้อมูลนักศึกษา</div>
                )
            )}
        </>


    )
}

export default ReportAllStudent
