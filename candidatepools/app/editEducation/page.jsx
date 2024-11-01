"use client"

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Loader from '../components/Loader'
import Swal from 'sweetalert2'
import Icon from '@mdi/react'
import { saveAs } from 'file-saver'
import { mdiDelete, mdiDownload, mdiPencil, mdiContentSave, mdiArrowDownDropCircle, mdiCloseCircle, mdiPlus } from '@mdi/js'

// Firebase
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from '@/app/firebaseConfig'
import { useTheme } from "../ThemeContext"

function EditEducation() {
    const router = useRouter()
    const { status, data: session } = useSession()
    const [dataUser, setDataUser] = useState(null)
    const [loader, setLoader] = useState(true)
    const [typePerson, setTypePerson] = useState("")
    const [error, setError] = useState('')
    const [uploadProgress, setUploadProgress] = useState(0)
    const inputFileRef = useRef(null)
    const [inputNameFile, setInputNameFile] = useState('')

    const { fontSize, bgColor, bgColorMain } = useTheme()

    // Function to handle document upload with Firebase storage
    const handleDocument = async (event) => {
        const selectedFile = event.target.files[0]
        if (!selectedFile) return

        setLoader(true)
        const fileExtension = selectedFile.name.split('.').pop()
        if (fileExtension !== 'pdf') {
            setError('Please upload a PDF file only')
            setLoader(false)
            return
        }

        const fileName = inputNameFile || selectedFile.name
        const storageRef = ref(storage, `users/documents/${session?.user?.email}/${fileName}`)
        const uploadTask = uploadBytesResumable(storageRef, selectedFile)

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                setUploadProgress(progress)
            },
            (error) => {
                console.error('Error uploading file:', error)
                setLoader(false)
            },
            async () => {
                try {
                    const url = await getDownloadURL(uploadTask.snapshot.ref)
                    setFiles((prevFiles) => [...prevFiles, url])
                    setUploadProgress(0)
                    inputFileRef.current.value = ''
                } catch (error) {
                    console.error('Error getting download URL:', error)
                }
                setLoader(false)
            }
        )
    }

    // Function to handle downloading file from Firebase storage
    const handleDownloadFile = async (filePath, nameFile) => {
        const storage = getStorage()
        const fileRef = ref(storage, filePath)

        try {
            const downloadURL = await getDownloadURL(fileRef)
            const response = await fetch(downloadURL)
            if (!response.ok) throw new Error('Failed to fetch file')
            const blob = await response.blob()
            saveAs(blob, nameFile)
        } catch (error) {
            console.error("Error downloading file:", error)
        }
    }

    // Get user data
    const getUser = async (id) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/api/user/${id}`, {
                method: "GET",
                cache: "no-store"
            })
            if (!res.ok) throw new Error("Error getting data from API")
            const data = await res.json()
            setDataUser(data.user || {})
        } catch (error) {
            console.error("Error fetching API", error)
        } finally {
            setLoader(false)
        }
    }

    // Fetch data on component mount
    useEffect(() => {
        if (status === 'loading') return
        if (!session) {
            router.replace('/')
            return
        }

        if (session?.user?.id) {
            getUser(session.user.id)
            getEducation(session.user.id)
        } else {
            router.replace('/register')
        }
    }, [status, session, router])

    useEffect(() => {
        if (!dataUser || Object.keys(dataUser).length === 0) {
            router.replace('/register')
        }
    }, [dataUser, router])

    return (
        <div className={`${bgColorMain} ${bgColor} ${fontSize}`}>
            <div className="flex">
                <div className="w-10/12 px-7 py-5">
                    <div className="rounded-lg p-5">
                        <form onSubmit={(e) => handleSubmit(e)} className="flex flex-wrap">
                            {/* Fields and other components go here */}
                        </form>
                    </div>
                </div>
            </div>
            {loader && <Loader />}
        </div>
    )
}

export default EditEducation
