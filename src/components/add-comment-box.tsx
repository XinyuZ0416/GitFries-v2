'use client'

import MDEditor from '@uiw/react-md-editor'
import React, { useState } from 'react'
import rehypeSanitize from 'rehype-sanitize'

export default function AddCommentBox() {
  const [ comment, setComment ] = useState<string>();

  const handleChange = (e: any) => {
    setComment(e);
  }

  return (
    <>
    <div className='flex flex-col gap-3'>
      <img className="rounded-full size-14" src="/potato.png" alt="user profile" />
      <form>
        <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
          <div className="px-4 py-2 bg-white rounded-t-lg dark:bg-gray-800">
            <label htmlFor="comment" className="sr-only">Your comment</label>
            <fieldset className="mb-5">
              <label htmlFor="comment" className="block mb-2 text-sm font-medium"></label>
              <div className="container" data-color-mode="light">
                <MDEditor
                  id="comment"
                  value={comment}
                  onChange={handleChange}
                  previewOptions={{
                    rehypePlugins: [[rehypeSanitize]],
                  }}
                />
              </div>
            </fieldset>
            
          </div>
            <div className="flex items-center justify-between px-3 py-2 border-t dark:border-gray-600 border-gray-200">
              <button type="submit" className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-blue-700 rounded-lg focus:ring-4 focus:ring-blue-200 dark:focus:ring-blue-900 hover:bg-blue-800">
                  Post comment
              </button>
            </div>
        </div>
      </form>
    </div>
    
    </>
  )
}
