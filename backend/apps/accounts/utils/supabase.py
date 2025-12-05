from supabase import create_client, Client
import os

url = os.getenv('SUPABASE_URL')
key = os.getenv('SUPABASE_ANON_KEY')
supabase: Client = create_client(url, key)

ALLOWED_RESUME_EXTENSIONS = ['.pdf', '.doc', '.docx']
MAX_FILE_SIZE = 10 * 1024 * 1024 

def validate_resume_file(file):
    if file.size > MAX_FILE_SIZE:
        return False, "File size exceeds 10MB limit"
    
    file_extension = os.path.splitext(file.name)[1].lower()
    if file_extension not in ALLOWED_RESUME_EXTENSIONS:
        return False, f"Invalid file type. Allowed types: {', '.join(ALLOWED_RESUME_EXTENSIONS)}"
    
    return True, None

def upload_file(file, file_path):
    try:
        file.seek(0)
        
        file_content = file.read()
        
        response = supabase.storage.from_("resume").upload(
            path=file_path,
            file=file_content,
            file_options={"content-type": file.content_type}
        )
        
        if hasattr(response, 'error') and response.error:
            print(f"Supabase upload error: {response.error}")
            return None
        
        public_url_response = supabase.storage.from_("resume").get_public_url(file_path)
        return public_url_response
    
    except Exception as e:
        print(f"Exception while uploading resume: {str(e)}")
        return None
