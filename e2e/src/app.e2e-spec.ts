import { AppPage } from './app.po';

describe('iiengine App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display project name', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Собиратели яблок');
  });
});
