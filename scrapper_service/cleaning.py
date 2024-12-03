import re

def clean_text_file(input_file, output_file):
    try:
        with open(input_file, "r", encoding="utf-8", errors="ignore") as infile:
            text = infile.read()
        
        # Remove non-printable characters and other unreadable content
        cleaned_text = re.sub(r'[^\x20-\x7E\n\r\t]', '', text)

        # Write cleaned content to the output file
        with open(output_file, "w", encoding="utf-8") as outfile:
            outfile.write(cleaned_text)

        print(f"Cleaning completed. Cleaned text saved to '{output_file}'.")
    
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    input_file = "./data/pec.ac.in_2024-12-03_19-07-20.txt"   # Replace with the path to your input .txt file
    output_file = "out.txt"  # Replace with the desired output file path

    clean_text_file(input_file, output_file)