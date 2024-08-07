import * as fs from 'fs';
import * as path from 'path';

const projectsDir = 'C:\\Users\\dazzl\\CodingProjects\\substrate';
const noteTakerDir = 'C:\\Users\\dazzl\\CodingProjects\\substrate\\note-taker';
const consolidatedNotesDir = path.join(noteTakerDir, 'notes');
const generalNotesDir = path.join(noteTakerDir, 'dailyNotes');

// Create consolidated notes directory if it doesn't exist
if (!fs.existsSync(consolidatedNotesDir)) {
    fs.mkdirSync(consolidatedNotesDir, { recursive: true });
}

function consolidateNotes() {
    const projects = fs.readdirSync(projectsDir).filter(project => project !== 'note-taker');;
    const generalNotes = fs.existsSync(generalNotesDir) ? fs.readdirSync(generalNotesDir) : [];

    // Process general notes first
    for (const note of generalNotes) {
        if (note.endsWith('.md')) {
            const notePath = path.join(generalNotesDir, note);
            let noteContent = fs.readFileSync(notePath, 'utf-8');
            const noteDate = note.replace('.md', '');
            const consolidatedNotePath = path.join(consolidatedNotesDir, `${noteDate}.md`);

            // Skip the first line (date) of the note content
            noteContent = noteContent.split('\n').slice(1).join('\n').trim();

            // Skip this file if it's empty after removing the date
            if (noteContent === '') {
                continue;
            }

            let consolidatedContent = '';
            if (fs.existsSync(consolidatedNotePath)) {
                consolidatedContent = fs.readFileSync(consolidatedNotePath, 'utf-8');
                // Update or add General Notes section
                const generalNotesRegex = new RegExp(`\n## General Notes\n(.*?)(?=\n## |\n# |\n$)`, 's');
                // const projectRegex =      new RegExp(`\n## ${project}   \n(.*?)(?=\n## |\n# |\n$)`, 's');
                const match = consolidatedContent.match(generalNotesRegex);
                if (match) {
                    consolidatedContent = consolidatedContent.replace(
                        match[0],
                        `\n## General Notes\n\n${noteContent}\n`
                    );
                } else {
                    consolidatedContent = consolidatedContent.replace(
                        /^# .*?\n/,
                        `$&\n## General Notes\n\n${noteContent}\n`
                    );
                }
            } else {
                consolidatedContent = `# -------------------------- ${noteDate} --------------------------\n\n## General Notes\n\n${noteContent}\n`;
            }

            fs.writeFileSync(consolidatedNotePath, consolidatedContent.trim() + '\n');
        }
    }

    // Process project notes
    for (const project of projects) {
        const projectPath = path.join(projectsDir, project);
        const dailyNotesPath = path.join(projectPath, 'dailyNotes');

        if (fs.existsSync(dailyNotesPath) && fs.statSync(dailyNotesPath).isDirectory()) {
            const notes = fs.readdirSync(dailyNotesPath);

            for (const note of notes) {
                if (note.endsWith('.md')) {
                    const notePath = path.join(dailyNotesPath, note);
                    let noteContent = fs.readFileSync(notePath, 'utf-8');
                    const noteDate = note.replace('.md', '');
                    const consolidatedNotePath = path.join(consolidatedNotesDir, `${noteDate}.md`);

                    // Skip the first line (date) of the note content
                    noteContent = noteContent.split('\n').slice(1).join('\n').trim();

                    // Skip this file if it's empty after removing the date
                    if (noteContent === '') {
                        continue;
                    }

                    let consolidatedContent = '';
                    if (fs.existsSync(consolidatedNotePath)) {
                        consolidatedContent = fs.readFileSync(consolidatedNotePath, 'utf-8');
                        
                        // Check if project section already exists
                        const projectRegex = new RegExp(`\n## ${project}\n(.*?)(?=\n## |\n# |\n$)`, 's');
                        const match = consolidatedContent.match(projectRegex);
                        
                        if (match) {
                            // Replace existing project section
                            consolidatedContent = consolidatedContent.replace(
                                match[0],
                                `\n## ${project}\n\n${noteContent}\n`
                            );
                        } else {
                            // Add new project section
                            consolidatedContent += `\n## ${project}\n\n${noteContent}\n`;
                        }
                    } else {
                        // Create new consolidated note file
                        consolidatedContent = `# -------------------------- ${noteDate} --------------------------\n\n## ${project}\n\n${noteContent}\n`;
                    }

                    fs.writeFileSync(consolidatedNotePath, consolidatedContent.trim() + '\n');
                }
            }
        }
    }
}

// Run the consolidation
consolidateNotes();
console.log('Notes consolidated successfully!');