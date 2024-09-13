// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Set, Router, Route, PrivateSet } from '@redwoodjs/router'

import AdminLayout from 'src/layouts/Admin/AdminLayout'

const CategoriesLayout = ({ children }: { children: React.ReactNode }) => (
  <AdminLayout title="Categories" titleTo="adminCategories" buttonLabel="New Category" buttonTo="adminNewCategory">
    {children}
  </AdminLayout>
)
const RecipesLayout = ({ children }: { children: React.ReactNode }) => (
  <AdminLayout title="Recipes" titleTo="adminRecipes" buttonLabel="New Recipe" buttonTo="adminNewRecipe">
    {children}
  </AdminLayout>
)

import { useAuth } from './auth'

const Routes = () => {
  return (
    <Router useAuth={useAuth}>
      <PrivateSet unauthenticated="login">
        <Route path="/my-recipes" page={MyRecipesPage} name="myRecipes" />
        <Set wrap={CategoriesLayout}>
          <Route path="/admin/categories/new" page={AdminCategoryNewCategoryPage} name="adminNewCategory" />
          <Route path="/admin/categories/{id}/edit" page={AdminCategoryEditCategoryPage} name="adminEditCategory" />
          <Route path="/admin/categories/{id}" page={AdminCategoryCategoryPage} name="adminCategory" />
          <Route path="/admin/categories" page={AdminCategoryCategoriesPage} name="adminCategories" />
        </Set>
        <Set wrap={RecipesLayout}>
          <Route path="/admin/recipes/new" page={AdminRecipeNewRecipePage} name="adminNewRecipe" />
          <Route path="/admin/recipes/{id}/edit" page={AdminRecipeEditRecipePage} name="adminEditRecipe" />
          <Route path="/admin/recipes/{id}" page={AdminRecipeRecipePage} name="adminRecipe" />
          <Route path="/admin/recipes" page={AdminRecipeRecipesPage} name="adminRecipes" />
        </Set>
      </PrivateSet>
      <Route path="/login" page={LoginPage} name="login" />
      <Route path="/signup" page={SignupPage} name="signup" />
      <Route path="/forgot-password" page={ForgotPasswordPage} name="forgotPassword" />
      <Route path="/reset-password" page={ResetPasswordPage} name="resetPassword" />
      <Route path="/recipe/{id}" page={RecipePage} name="recipe" />
      <Route path="/" page={LandingPage} name="landing" />
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes
