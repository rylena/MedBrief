import unittest
import json
from app import app

class MedBriefTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_index(self):
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'MedBrief', response.data)

    def test_summarize_no_text_or_file(self):
        response = self.app.post('/summarize', 
                                 data=json.dumps({'text': ''}),
                                 content_type='application/json')
        self.assertEqual(response.status_code, 400)

    def test_summarize_with_text_form_data(self):
        response = self.app.post('/summarize', 
                                 data={'text': 'Patient has a headache.'})
        self.assertNotEqual(response.status_code, 400)

    
if __name__ == '__main__':
    unittest.main()
