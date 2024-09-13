import type {
  CreateRecipeMutation,
  CreateRecipeInput,
  CreateRecipeMutationVariables,
} from 'types/graphql'

import { navigate, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import RecipeForm from 'src/components/Admin/Recipe/RecipeForm'

const CREATE_RECIPE_MUTATION: TypedDocumentNode<
  CreateRecipeMutation,
  CreateRecipeMutationVariables
> = gql`
  mutation CreateRecipeMutation($input: CreateRecipeInput!) {
    createRecipe(input: $input) {
      id
    }
  }
`

const NewRecipe = () => {
  const [createRecipe, { loading, error }] = useMutation(
    CREATE_RECIPE_MUTATION,
    {
      onCompleted: () => {
        toast.success('Recipe created')
        navigate(routes.adminRecipes())
      },
      onError: (error) => {
        toast.error(error.message)
      },
    }
  )

  const onSave = (input: CreateRecipeInput) => {
    createRecipe({ variables: { input } })
  }

  return (
    <div className="rw-segment">
      <header className="rw-segment-header">
        <h2 className="rw-heading rw-heading-secondary">New Recipe</h2>
      </header>
      <div className="rw-segment-main">
        <RecipeForm onSave={onSave} loading={loading} error={error} />
      </div>
    </div>
  )
}

export default NewRecipe
