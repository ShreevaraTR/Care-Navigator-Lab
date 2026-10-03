import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { EmptyState, ButtonLink } from "@/components/ui";
import { DashboardPage } from "@/features/dashboard/DashboardPage";
import { LearnPage } from "@/features/learn/LearnPage";
import { LessonPage } from "@/features/learn/LessonPage";
import { KnowledgeBasePage } from "@/features/learn/KnowledgeBasePage";
import { ConceptPage } from "@/features/learn/ConceptPage";
import { SimulationsPage } from "@/features/simulations/SimulationsPage";
import { CaseWorkspacePage } from "@/features/simulations/CaseWorkspacePage";
import { CaseHistoryPage } from "@/features/history/CaseHistoryPage";
import { CaseReviewPage } from "@/features/history/CaseReviewPage";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="learn" element={<LearnPage />} />
          <Route path="learn/lessons/:lessonId" element={<LessonPage />} />
          <Route path="learn/remote-health-usa" element={<KnowledgeBasePage />} />
          <Route path="learn/concepts/:conceptId" element={<ConceptPage />} />
          <Route path="simulations" element={<SimulationsPage />} />
          <Route path="simulations/:caseId" element={<CaseWorkspacePage />} />
          <Route path="history" element={<CaseHistoryPage />} />
          <Route path="history/:attemptId" element={<CaseReviewPage />} />
          <Route
            path="*"
            element={<EmptyState title="Page not found" action={<ButtonLink to="/">Back to dashboard</ButtonLink>} />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
