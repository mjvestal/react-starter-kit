/*! React Starter Kit | MIT License | http://www.reactstarterkit.com/ */

import React from 'react';
import Router from 'react-routing/src/Router';
import http from './core/HttpClient';
import App from './components/App';
import NotFoundPage from './components/NotFoundPage';
import ErrorPage from './components/ErrorPage';

const router = new Router(on => {
  on('*', async (state, next) => {
    const component = await next();
    return component && <App context={state.context}>{component}</App>;
  });

  on('/contact', async () => {
    let ContactPage;
    require.ensure([], ()=> { // this syntax is weird but it works
      ContactPage = require('./components/ContactPage');
    });

    await Promise.all([
      new Promise(resolve => require.ensure(['./components/ContactPage'], resolve)),
    ]);
    return <ContactPage />;
  });

  on('/login', async () => {
    let LoginPage;
    require.ensure([], ()=> { // this syntax is weird but it works
      LoginPage = require('./components/LoginPage');
    });

    await Promise.all([
      new Promise(resolve => require.ensure(['./components/LoginPage'], resolve)),
    ]);
    return <LoginPage />;
  });

  on('/register', async () => {
    let RegisterPage;
    require.ensure([], ()=> { // this syntax is weird but it works
      RegisterPage = require('./components/RegisterPage');
    });

    await Promise.all([
      new Promise(resolve => require.ensure(['./components/RegisterPage'], resolve)),
    ]);
    return <RegisterPage />;
  });

  // on('/products', async () => {
  //   const [data, require] = await Promise.all([
  //     http.get('/api/products'),
  //     new Promise(resolve => require.ensure(['./components/ProductsPage'], resolve)),
  //   ]);
  //   const ProductsPage = require('./components/ProductsPage');
  //   return data ? <ProductsPage products={data} /> : undefined;
  // });

  on('*', async (state) => {
    let ContentPage;
    require.ensure([], ()=> { // this syntax is weird but it works
      ContentPage = require('./components/ContentPage');
    });
    const [content] = await Promise.all([
      http.get(`/api/content/?path=${state.path}`),
      new Promise(resolve => require.ensure(['./components/ContentPage'], resolve)),
    ]);
    return content && <ContentPage {...content} />;
  });

  on('error', (state, error) => state.statusCode === 404 ?
    <App context={state.context} error={error}><NotFoundPage /></App> :
    <App context={state.context} error={error}><ErrorPage /></App>
  );
});

export default router;
