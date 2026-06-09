import os
import tempfile
from jinja2 import Template

try:
    from weasyprint import HTML
    WEASYPRINT_AVAILABLE = True
except ImportError:
    WEASYPRINT_AVAILABLE = False

class PDFGenerationService:
    @staticmethod
    def generate_investment_memo(company_id: str, memo_data: dict) -> str:
        """
        Generates a PDF investment memo and returns the file path.
        """
        # Simple HTML template for the memo
        html_template = """
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; line-height: 1.6; padding: 20px; }
                h1 { color: #1a365d; border-bottom: 2px solid #1a365d; padding-bottom: 10px; }
                h2 { color: #2b6cb0; margin-top: 30px; }
                .executive-summary { background-color: #f7fafc; padding: 15px; border-left: 4px solid #4299e1; margin-bottom: 20px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; }
                th { background-color: #edf2f7; }
                .footer { margin-top: 50px; font-size: 12px; color: #718096; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; }
            </style>
        </head>
        <body>
            <h1>VentureLens Investment Memo</h1>
            <p><strong>Company:</strong> {{ company_name }}</p>
            <p><strong>Date:</strong> {{ date }}</p>
            <p><strong>Prepared By:</strong> VentureLens AI Intelligence Layer</p>
            
            <div class="executive-summary">
                <h2>Executive Summary</h2>
                <p>{{ executive_summary }}</p>
            </div>
            
            <h2>Financial Health</h2>
            <table>
                <tr><th>Metric</th><th>Value</th></tr>
                <tr><td>ARR</td><td>{{ arr }}</td></tr>
                <tr><td>Burn Multiple</td><td>{{ burn_multiple }}</td></tr>
                <tr><td>Rule of 40</td><td>{{ rule_of_40 }}</td></tr>
            </table>
            
            <h2>Investment Committee Decision</h2>
            <p><strong>Verdict:</strong> {{ verdict }}</p>
            <p>{{ ic_notes }}</p>
            
            <div class="footer">
                VentureLens AI Institutional Platform - Strictly Confidential
            </div>
        </body>
        </html>
        """
        
        template = Template(html_template)
        html_content = template.render(
            company_name=memo_data.get("company_name", "Unknown"),
            date=memo_data.get("date", "2026-06-09"),
            executive_summary=memo_data.get("executive_summary", "No summary available."),
            arr=memo_data.get("arr", "N/A"),
            burn_multiple=memo_data.get("burn_multiple", "N/A"),
            rule_of_40=memo_data.get("rule_of_40", "N/A"),
            verdict=memo_data.get("verdict", "Pending"),
            ic_notes=memo_data.get("ic_notes", "")
        )
        
        # Create a temporary file for the PDF
        fd, pdf_path = tempfile.mkstemp(suffix=".pdf", prefix=f"memo_{company_id}_")
        os.close(fd)
        
        if WEASYPRINT_AVAILABLE:
            HTML(string=html_content).write_pdf(pdf_path)
        else:
            # Fallback if WeasyPrint is not installed (e.g. missing GTK dependencies)
            with open(pdf_path, 'w', encoding='utf-8') as f:
                f.write("PDF Generation requires WeasyPrint. Please install it to generate actual PDFs.\n\n")
                f.write(html_content)
        
        return pdf_path
