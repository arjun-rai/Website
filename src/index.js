import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './index.css';

import SiteLayout, {
  AboutPage,
  ContactPage,
  HomePage,
  LegacyProjectRedirect,
  LegacyWorkRedirect,
  NotFoundPage,
  ProjectsPage,
} from './PortfolioPage';

const root = createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
      <Routes>
        <Route path="/" element={<SiteLayout />}>
          <Route index element={<HomePage />} />
          <Route path="work" element={<LegacyWorkRedirect />} />
          <Route path="work/:slug" element={<LegacyProjectRedirect />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:slug" element={<LegacyProjectRedirect />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
  </BrowserRouter>
);
