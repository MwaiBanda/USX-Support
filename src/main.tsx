import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ApolloProvider } from '@apollo/client'
import { client } from './lib/apollo.ts'
import { BrowserRouter, Routes, Route, Navigate } from "react-router";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <ApolloProvider client={client}>
        <BrowserRouter>
          <Routes>
            <Route path="/:version/:book" element={<App />} />
            <Route
              path="*"
              element={<Navigate to="/nlt/jhn" />}
            />         
          </Routes>
        </BrowserRouter>
      </ApolloProvider>
  </StrictMode>,
)
