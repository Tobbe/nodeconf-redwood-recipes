import type {
  DeleteRecipeMutation,
  DeleteRecipeMutationVariables,
  FindRecipeById,
} from 'types/graphql'

import { Link, routes, navigate } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { timeTag } from 'src/lib/formatters'

const DELETE_RECIPE_MUTATION: TypedDocumentNode<
  DeleteRecipeMutation,
  DeleteRecipeMutationVariables
> = gql`
  mutation DeleteRecipeMutation($id: String!) {
    deleteRecipe(id: $id) {
      id
    }
  }
`

interface Props {
  recipe: NonNullable<FindRecipeById['recipe']>
}

const Recipe = ({ recipe }: Props) => {
  const [deleteRecipe] = useMutation(DELETE_RECIPE_MUTATION, {
    onCompleted: () => {
      toast.success('Recipe deleted')
      navigate(routes.adminRecipes())
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const onDeleteClick = (id: DeleteRecipeMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete recipe ' + id + '?')) {
      deleteRecipe({ variables: { id } })
    }
  }

  return (
    <>
      <div className="rw-segment">
        <header className="rw-segment-header">
          <h2 className="rw-heading rw-heading-secondary">
            Recipe {recipe.id} Detail
          </h2>
        </header>
        <table className="rw-table">
          <tbody>
            <tr>
              <th>Id</th>
              <td>{recipe.id}</td>
            </tr>
            <tr>
              <th>Name</th>
              <td>{recipe.name}</td>
            </tr>
            <tr>
              <th>Cuisine</th>
              <td>{recipe.cuisine}</td>
            </tr>
            <tr>
              <th>Created at</th>
              <td>{timeTag(recipe.createdAt)}</td>
            </tr>
            <tr>
              <th>Content</th>
              <td>{recipe.content}</td>
            </tr>
            <tr>
              <th>Image url</th>
              <td>{recipe.imageUrl}</td>
            </tr>
            <tr>
              <th>Blurb</th>
              <td>{recipe.blurb}</td>
            </tr>
            <tr>
              <th>Category id</th>
              <td>{recipe.categoryId}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <nav className="rw-button-group">
        <Link
          to={routes.adminEditRecipe({ id: recipe.id })}
          className="rw-button rw-button-blue"
        >
          Edit
        </Link>
        <button
          type="button"
          className="rw-button rw-button-red"
          onClick={() => onDeleteClick(recipe.id)}
        >
          Delete
        </button>
      </nav>
    </>
  )
}

export default Recipe
