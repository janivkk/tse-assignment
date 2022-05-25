import React from 'react';
import SinglePagePreviewPDF from './SinglePage';
import privacyPDF from '../../PrivacyPolicy.pdf';
import {
    render, 
    screen,
    getByLabelText,
    waitFor
} from '../utils-test';


describe('Single Page PDF Preview', () => {

    it('renders without crashing when no pdf specified', async() => {
        const {container} = render(
            <SinglePagePreviewPDF />
        );

        const docContainer = getByLabelText(container, 'doc-container');
        expect(docContainer).toBeVisible();

        // no PDF message
        const noPDF_Text = await screen.findByText(
            "No PDF file specified.", 
            { timeout: 1000 }
        );
        expect(noPDF_Text).toBeInTheDocument();
    });

    it('renders loading message when pdf is loading', async() => {
        const {container} = render(
            <SinglePagePreviewPDF 
                pdf={privacyPDF} />
        );
 
        const docContainer = getByLabelText(container, 'doc-container');
        expect(docContainer).toBeVisible();
 
        // shows loading message
        const loading = await screen.findByText(
            "Loading PDF…", 
            { timeout: 1000 }
        );
        expect(loading).toBeInTheDocument();
    });

    it('renders pdf once loaded', () => {
        render(
            <SinglePagePreviewPDF 
                pdf={privacyPDF} />
        );

        // wait until pdf has loaded
        waitFor(() => {
            const document = screen.getByRole( /Document/ );
            expect(document).toBeVisible();

            const page =  screen.getByRole( /Page/ );
            expect(page).toBeVisible();
        });
    });
});
