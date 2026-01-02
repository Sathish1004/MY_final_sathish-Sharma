import re

file_path = 'Frontend/src/data/courses.ts'

try:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace totalVideos
    content = re.sub(r'totalVideos: \d+', 'totalVideos: 8', content)
    
    # Replace duration
    # This regex looks for duration: '...' and replaces with duration: '2 Hours'
    content = re.sub(r"duration: '[^']+'", "duration: '2 Hours'", content)

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print("Successfully updated courses.ts")

except Exception as e:
    print(f"Error: {e}")
