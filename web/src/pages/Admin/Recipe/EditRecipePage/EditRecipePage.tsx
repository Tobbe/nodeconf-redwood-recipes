import EditRecipeCell from 'src/components/Admin/Recipe/EditRecipeCell'

type RecipePageProps = {
  id: string
}

const EditRecipePage = ({ id }: RecipePageProps) => {
  return <EditRecipeCell id={id} />
}

export default EditRecipePage
