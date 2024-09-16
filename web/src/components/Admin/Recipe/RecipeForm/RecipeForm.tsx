import React, { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import type { DropEvent } from 'react-dropzone'

import type { EditRecipeById, FindCategories } from 'types/graphql'

import type { RWGqlError } from '@redwoodjs/forms'
import {
  FileField,
  Form,
  FormError,
  FieldError,
  Label,
  TextField,
  Submit,
  SelectField,
} from '@redwoodjs/forms'
import { isUploadedImage, makeUrl } from 'src/lib/images'

type FormRecipe = NonNullable<EditRecipeById['recipe']> & {
  image: FileList
}

class ManualEvent extends Event {
  constructor(type: string, eventInit?: EventInit) {
    super(type, eventInit)
  }
}

function isManualEvent(event?: object): event is ManualEvent {
  return (
    event && 'nativeEvent' in event && event.nativeEvent instanceof ManualEvent
  )
}

interface RecipeFormProps {
  recipe?: EditRecipeById['recipe']
  categories?: FindCategories['categories']
  onSave: (data: FormRecipe, id?: FormRecipe['id']) => void
  error: RWGqlError
  loading: boolean
}

const RecipeForm = (props: RecipeFormProps) => {
  const [previews, setPreviews] = useState([])

  const onDropAccepted = useCallback(
    (acceptedFiles: File[], event: DropEvent) => {
      if (!inputRef.current) {
        return
      }

      const dataTransfer = new DataTransfer()
      const previews = []

      acceptedFiles.forEach((file) => {
        dataTransfer.items.add(file)
        previews.push(URL.createObjectURL(file))
      })

      inputRef.current.files = dataTransfer.files

      // Help Safari out
      if (inputRef.current.webkitEntries.length) {
        inputRef.current.dataset.file = `${dataTransfer.files[0].name}`
      }

      // Prevent an infinite loop by checking if the event is already a manual
      // event
      if (!isManualEvent(event)) {
        // Let react-hook-forms know about the new files
        inputRef.current?.dispatchEvent(
          new ManualEvent('change', { bubbles: true })
        )
      }

      setPreviews(previews)
    },
    []
  )

  const { getRootProps, getInputProps, rootRef, inputRef, open } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.gif', '.png'],
    },
    noClick: true,
    multiple: false,
    onDropAccepted,
  })

  useEffect(() => {
    if (!rootRef.current) return

    const handlePasteFile = async (event: ClipboardEvent) => {
      if (event.clipboardData?.files) {
        inputRef.current.files = event.clipboardData.files

        // Trigger onDropAccepted and let react-hook-forms know about the new
        // files
        inputRef.current?.dispatchEvent(
          new ManualEvent('change', { bubbles: true })
        )
      }
    }

    rootRef.current.addEventListener('paste', handlePasteFile)

    return () => {
      rootRef.current?.removeEventListener('paste', handlePasteFile)
    }
  }, [rootRef])

  const onSubmit = (data: FormRecipe) => {
    props.onSave(data, props?.recipe?.id)
  }

  return (
    <div className="rw-form-wrapper">
      <Form<FormRecipe> onSubmit={onSubmit} error={props.error}>
        <FormError
          error={props.error}
          wrapperClassName="rw-form-error-wrapper"
          titleClassName="rw-form-error-title"
          listClassName="rw-form-error-list"
        />

        <Label
          name="name"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Name
        </Label>

        <TextField
          name="name"
          defaultValue={props.recipe?.name}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="name" className="rw-field-error" />

        <Label
          name="cuisine"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Cuisine
        </Label>

        <TextField
          name="cuisine"
          defaultValue={props.recipe?.cuisine}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="cuisine" className="rw-field-error" />

        <Label
          name="content"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Content
        </Label>

        <TextField
          name="content"
          defaultValue={props.recipe?.content}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
          validation={{ required: true }}
        />

        <FieldError name="content" className="rw-field-error" />

        <Label
          name="imageUrl"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Image url
        </Label>

        <TextField
          name="imageUrl"
          defaultValue={props.recipe?.imageUrl}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="imageUrl" className="rw-field-error" />

        <Label
          name="image"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Upload Image
        </Label>

        <div {...getRootProps({ className: 'rw-input rw-drop-target' })}>
          <FileField {...getInputProps({ name: 'image' })} />
          <p>Drag and drop, or copy/paste an image here</p>
          <button
            type="button"
            onClick={open}
            className="rw-button rw-button-blue"
          >
            Open File Dialog
          </button>
        </div>

        {previews.map((file) => (
          <div className="rw-image-preview" key={file}>
            <div>
              <img
                src={file}
                // Revoke data uri after image is loaded
                onLoad={() => {
                  URL.revokeObjectURL(file)
                }}
              />
            </div>
          </div>
        ))}
        {previews.length === 0 && isUploadedImage(props.recipe?.imageUrl) && (
          <img
            src={makeUrl(props.recipe.imageUrl)}
            alt="Recipe Image"
            className="rw-image-preview"
          />
        )}

        <FieldError name="image" className="rw-field-error" />

        <Label
          name="blurb"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Blurb
        </Label>

        <TextField
          name="blurb"
          defaultValue={props.recipe?.blurb}
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />

        <FieldError name="blurb" className="rw-field-error" />

        <Label
          name="categoryId"
          className="rw-label"
          errorClassName="rw-label rw-label-error"
        >
          Category
        </Label>

        {props.categories ? (
          <SelectField
            name="categoryId"
            defaultValue={props.recipe?.categoryId}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
          >
            {props.categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </SelectField>
        ) : (
          <TextField
            name="categoryId"
            defaultValue={props.recipe?.categoryId}
            className="rw-input"
            errorClassName="rw-input rw-input-error"
            emptyAs={'undefined'}
          />
        )}

        <FieldError name="categoryId" className="rw-field-error" />

        <div className="rw-button-group">
          <Submit disabled={props.loading} className="rw-button rw-button-blue">
            Save
          </Submit>
        </div>
      </Form>
    </div>
  )
}

export default RecipeForm
