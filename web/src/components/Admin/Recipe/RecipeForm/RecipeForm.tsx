import type {
  EditRecipeById,
  FindCategories,
  UpdateRecipeInput,
} from 'types/graphql'

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

type FormRecipe = NonNullable<EditRecipeById['recipe']>

interface RecipeFormProps {
  recipe?: EditRecipeById['recipe']
  categories?: FindCategories['categories']
  onSave: (data: UpdateRecipeInput, id?: FormRecipe['id']) => void
  error: RWGqlError
  loading: boolean
}

const RecipeForm = (props: RecipeFormProps) => {
  const onSubmit = (data: FormRecipe) => {
    props.onSave(data, props?.recipe?.id)
  }

  const isUploadedImage = (url?: string) => {
    return (
      url &&
      !(url.startsWith('http://') || url.startsWith('https://')) &&
      /\.(jpeg|jpg|gif|png)$/i.test(url)
    )
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

        <FileField
          name="image"
          className="rw-input"
          errorClassName="rw-input rw-input-error"
        />
        {isUploadedImage(props.recipe?.imageUrl) && (
          <img
            src={`${global.RWJS_API_URL}/${props.recipe?.imageUrl?.replace(
              'uploads/recipe-images',
              'recipe-photos'
            )}`}
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
