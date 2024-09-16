import type {
  QueryResolvers,
  MutationResolvers,
  RecipeRelationResolvers,
} from 'types/graphql'

import { db } from 'src/lib/db'
import { saveFiles } from 'src/lib/uploads'

export const recipes: QueryResolvers['recipes'] = ({
  category,
  forUser,
} = {}) => {
  const categoryFilter = category && { category: { id: category } }
  const userFilter = forUser && {
    users: {
      some: {
        id: context.currentUser?.id,
      },
    },
  }

  const filters = {
    where: { AND: [categoryFilter, userFilter].filter(Boolean) },
  }

  return db.recipe.findMany(filters)
}

export const recipe: QueryResolvers['recipe'] = ({ id }) => {
  return db.recipe.findUnique({
    where: { id },
  })
}

export const createRecipe: MutationResolvers['createRecipe'] = async ({
  input,
}) => {
  const processedInput = await saveFiles.forRecipe({
    ...input,
    imageUrl: input.image,
  })

  delete processedInput.image

  return db.recipe.create({
    data: processedInput,
  })
}

export const updateRecipe: MutationResolvers['updateRecipe'] = async ({
  id,
  input,
}) => {
  console.log('updateRecipe', { id, input })

  const processedInput = input.image
    ? await saveFiles.forRecipe({
        ...input,
        imageUrl: input.image,
      })
    : input

  console.log('updateRecipe', { id, processedInput })

  delete processedInput.image

  console.log('updateRecipe after delete', { id, processedInput })

  return db.recipe.update({
    data: processedInput,
    where: { id },
  })
}

export const deleteRecipe: MutationResolvers['deleteRecipe'] = ({ id }) => {
  return db.recipe.delete({
    where: { id },
  })
}

export const addToMyRecipes: MutationResolvers['addToMyRecipes'] = ({ id }) => {
  return db.recipe.update({
    data: {
      users: {
        connect: { id: context.currentUser.id },
      },
    },
    where: { id },
  })
}

export const Recipe: RecipeRelationResolvers = {
  category: (_obj, { root }) => {
    return db.recipe.findUnique({ where: { id: root?.id } }).category()
  },
}
