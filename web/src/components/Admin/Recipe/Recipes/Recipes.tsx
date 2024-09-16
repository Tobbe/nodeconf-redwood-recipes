import type {
  DeleteRecipeMutation,
  DeleteRecipeMutationVariables,
  FindRecipes,
} from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import type { TypedDocumentNode } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import { QUERY } from 'src/components/Admin/Recipe/RecipesCell'
import { timeTag, truncate } from 'src/lib/formatters'
import { isUploadedImage, makeUrl } from 'src/lib/images'

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

function image(urlOrPath?: string) {
  if (!urlOrPath) {
    return null
  }

  const url = isUploadedImage(urlOrPath) ? makeUrl(urlOrPath) : urlOrPath

  return <img src={url} alt="recipe image" style={{ width: '100px' }} />
}

const RecipesList = ({ recipes }: FindRecipes) => {
  const [deleteRecipe] = useMutation(DELETE_RECIPE_MUTATION, {
    onCompleted: () => {
      toast.success('Recipe deleted')
    },
    onError: (error) => {
      toast.error(error.message)
    },
    // This refetches the query on the list page. Read more about other ways to
    // update the cache over here:
    // https://www.apollographql.com/docs/react/data/mutations/#making-all-other-cache-updates
    refetchQueries: [{ query: QUERY }],
    awaitRefetchQueries: true,
  })

  const onDeleteClick = (id: DeleteRecipeMutationVariables['id']) => {
    if (confirm('Are you sure you want to delete recipe ' + id + '?')) {
      deleteRecipe({ variables: { id } })
    }
  }

  return (
    <div className="rw-segment rw-table-wrapper-responsive">
      <table className="rw-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Cuisine</th>
            <th>Created at</th>
            <th>Content</th>
            <th>Image url</th>
            <th>Blurb</th>
            <th>Category id</th>
            <th>&nbsp;</th>
          </tr>
        </thead>
        <tbody>
          {recipes.map((recipe) => (
            <tr key={recipe.id}>
              <td>{truncate(recipe.id)}</td>
              <td>{truncate(recipe.name)}</td>
              <td>{truncate(recipe.cuisine)}</td>
              <td>{timeTag(recipe.createdAt)}</td>
              <td>{truncate(recipe.content)}</td>
              <td>{image(recipe.imageUrl)}</td>
              <td>{truncate(recipe.blurb)}</td>
              <td>{truncate(recipe.categoryId)}</td>
              <td>
                <nav className="rw-table-actions">
                  <Link
                    to={routes.adminRecipe({ id: recipe.id })}
                    title={'Show recipe ' + recipe.id + ' detail'}
                    className="rw-button rw-button-small"
                  >
                    Show
                  </Link>
                  <Link
                    to={routes.adminEditRecipe({ id: recipe.id })}
                    title={'Edit recipe ' + recipe.id}
                    className="rw-button rw-button-small rw-button-blue"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    title={'Delete recipe ' + recipe.id}
                    className="rw-button rw-button-small rw-button-red"
                    onClick={() => onDeleteClick(recipe.id)}
                  >
                    Delete
                  </button>
                </nav>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default RecipesList
