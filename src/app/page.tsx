'use client'

import { useState } from 'react'
import styles from '@/app/upload.module.css'

const UploadForm = () => {
  const [files, setFiles] = useState<Array<File>>([])

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const droppedFiles = Array.from(event.dataTransfer.files)
    setFiles([...files, ...droppedFiles])
  }

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = Array.from(event.target.files || [])
    setFiles([...files, ...selectedFiles])
  }

  const handleFileDelete = (fileName: string) => {
    const updatedFiles = files.filter(file => file.name !== fileName)
    setFiles(updatedFiles)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!files) return

    // console.log({ files, currentTarget: e.currentTarget }, 'SUBMIT CLICKED')

    // TODO: good UI

    const body = new FormData()
    body.set('files', JSON.stringify(files, null, ' '))
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body,
      })
      // handle the error
      if (!res.ok) throw new Error(await res.text())
    } catch (e: any) {
      // Handle errors here
      console.error(e)
    }
  }

  return (
    <main>
      <form className={styles.container} onSubmit={handleSubmit}>
        <h2>Upload Files</h2>
        <div
          className={styles.dropzone}
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}>
          <p>Drag & Drop your files here or click to upload</p>
          <input
            type='file'
            id='fileElem'
            name='files'
            multiple
            onChange={handleFileInputChange}
          />
        </div>
        <div className={styles.files}>
          {files.length > 0 && (
            <ul>
              {files.map(file => (
                <li key={file.name}>
                  {file.name} ({file.size} bytes)
                  <button onClick={() => handleFileDelete(file.name)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <button type='submit'>Submit</button>
      </form>
    </main>
  )
}

export default UploadForm
