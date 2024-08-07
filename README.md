# Consolidate Note Files

To run > ts-node consolidatedNotes.ts

This works in conjunction extensions Notes and Foam. Notes configures ide for note taking in .md files.
Foam creates a new daily note everytime that we open a project repository on a new day
Foam creates folder in ${rootFodler}/dailyNotes/
New daily note created in dailyNotes folder as yyyy-mm-dd.md

note-taker>consolidateNotes.js will scan specified folder, projectsDir
i.e. const projectsDir = 'C:\\Users\\dazzl\\CodingProjects\\substrate';

Looks at every project folder within this directory, locates the dailyNotes folder,
reads every dailyNote file and copies the data into the note-taker/notes file for the given date.
The note-taker/dailyNotes/ folder is to be used as general notes. Thes note files will be written to the top
of each consolidated note file in a 'General Notes' secion. The note-taker dailyNotes will be skipped for the project notes.

All the other projects in the project directory will be read, and their note files will be written into the consolidated note file in their own section, under the header specified with the name of the project, the folder name.

The consolidated note will be written to the folder specified by consolidatedNotesDir. i.e
const consolidatedNotesDir = path.join(noteTakerDir, 'notes');