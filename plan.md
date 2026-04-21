# Plan: Button Styling and Admin Dashboard Refinement

## Goal
Match the "Become a Partner" button style to the "Hire a Professional" button on the home page. Ensure the Admin Dashboard is clearly separated and dedicated for uploading professional profiles.

## Technical Tasks
1.  **Update Button Styling**:
    *   Modify `src/components/Hero.tsx` to update the "Become a Partner" button styling. It should use the same font (black/bold), background color (amber-500), and transition effects as the "Hire a Professional" button.
2.  **Refine Admin Dashboard**:
    *   Update `src/pages/AdminDashboard.tsx` to make the "Add Professional" section more prominent.
    *   Set the default tab in `AdminDashboard` to 'add' if the user is visiting the page specifically for uploading, or ensure the "Upload" button is the main call to action.
    *   Enhance the Navbar Admin link to be more visible.
3.  **Validate Build**:
    *   Ensure all components are correctly imported and typed.
    *   Verify the styling matches the user's request.
