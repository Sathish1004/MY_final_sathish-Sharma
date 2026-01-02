
import fs from 'fs';

const path = 'c:\\Users\\srid5\\Desktop\\prolync documents\\project sathish\\sathishsharma\\Frontend\\src\\pages\\Projects.tsx';

try {
    let content = fs.readFileSync(path, 'utf8');
    const lines = content.split('\n');

    // Find where "/* Projects List */" starts to replace precisely from there
    let startIndex = -1;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('/* Projects List */')) {
            startIndex = i;
            break;
        }
    }

    if (startIndex !== -1) {
        // Keep everything up to "/* Projects List */" (exclusive of the line itself? No, replace from it)
        const newLines = lines.slice(0, startIndex);

        // Construct the corrected tail
        const newTail = `          /* Projects List */
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 container mx-auto max-w-7xl">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-border/50">
              <div className="space-y-1">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Project Collaborations
                </h1>
                <p className="text-muted-foreground text-lg max-w-2xl">
                  Work on real-world projects and gain practical experience with internship opportunities
                </p>
              </div>

              <div className="flex gap-3">
                <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-card border border-border/50 shadow-sm">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Users2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold leading-none">{stats.activeDevelopers}</p>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Active Developers</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 px-5 py-3 rounded-xl bg-card border border-border/50 shadow-sm">
                  <div className="bg-emerald-500/10 p-2 rounded-lg">
                    <Rocket className="h-5 w-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold leading-none">{stats.activeProjects}</p>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Active Projects</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Internship Partners */}
            <div className="bg-gradient-to-br from-card to-background border border-border/50 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="h-5 w-5 text-amber-500" />
                <h3 className="font-semibold text-lg">Internship Partners</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-6">Companies offering internships for successful project completion</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: 'Google', projects: 12, color: 'bg-red-500' },
                  { name: 'Microsoft', projects: 8, color: 'bg-blue-500' },
                  { name: 'Amazon', projects: 15, color: 'bg-orange-500' },
                  { name: 'Meta', projects: 6, color: 'bg-blue-600' }
                ].map((partner) => (
                  <div key={partner.name} className="flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-background/50 hover:bg-background hover:shadow-md transition-all cursor-pointer group">
                    <div className={\`h-10 w-10 rounded-full \${partner.color} flex items-center justify-center text-white font-bold shadow-sm group-hover:scale-110 transition-transform\`}>
                       <div className="h-3 w-3 bg-white rounded-full opacity-80" />
                    </div>
                    <div>
                      <p className="font-semibold">{partner.name}</p>
                      <p className="text-xs text-muted-foreground">{partner.projects} projects</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-64 rounded-xl bg-card border border-border/50 animate-pulse" />
                ))}
              </div>
            ) : (
              <>
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card/50 p-4 rounded-xl border border-border/50 backdrop-blur-sm sticky top-4 z-10 shadow-sm">
                  <div className="relative flex-1 w-full max-w-lg">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search projects, technologies, or descriptions..."
                      className="pl-10 border-border/50 bg-background/50"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2">
                       <Plus className="h-4 w-4" />
                       Propose Project
                    </Button>
                    <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                       Internship Projects
                    </Button>
                  </div>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects.map((project) => (
                    <Card
                      key={project.id}
                      className="group cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-border/50 overflow-hidden flex flex-col h-full bg-card"
                      onClick={() => setSelectedProject(project)}
                    >
                      <div className="h-2 w-full bg-gradient-to-r from-primary/80 to-primary/20" />
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start mb-2">
                          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Code2 className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex flex-col items-end gap-1">
                             {project.is_internship && (
                               <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-200 gap-1 px-2 py-0.5 text-[10px]">
                                 <Award className="h-3 w-3" /> Internship
                               </Badge>
                             )}
                             <Badge variant="outline" className={\`\${getStatusColor(project.status)} uppercase text-[10px] tracking-wider\`}>
                               {project.status}
                             </Badge>
                          </div>
                        </div>
                        <CardTitle className="text-xl line-clamp-1 group-hover:text-primary transition-colors">
                          {project.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2 min-h-[2.5rem]">
                          {project.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1 pb-3">
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.tech_stack && project.tech_stack.slice(0, 3).map((tech: string) => (
                            <Badge key={tech} variant="secondary" className="text-xs pointer-events-none bg-secondary/50">
                              {tech}
                            </Badge>
                          ))}
                          {project.tech_stack && project.tech_stack.length > 3 && (
                            <Badge variant="secondary" className="text-xs bg-secondary/50">+{project.tech_stack.length - 3}</Badge>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-3 border-t border-border/50 bg-muted/5 flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>{project.participants}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{project.duration}</span>
                        </div>
                        <Badge variant="outline" className={\`text-xs \${getDifficultyColor(project.difficulty)} border-current bg-transparent\`}>
                          {project.difficulty}
                        </Badge>
                      </CardFooter>
                    </Card>
                  ))}
                </div>

                {filteredProjects.length === 0 && (
                  <div className="text-center py-20">
                    <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No projects found</h3>
                    <p className="text-muted-foreground">Try adjusting your search or filters to find what you're looking for.</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </FeatureGuard>
  );
}
`;
        const newContent = newLines.join('\n') + '\n' + newTail;
        fs.writeFileSync(path, newContent, 'utf8');
        console.log('Successfully rewrote Projects.tsx from Projects List comment.');
    } else {
        console.error('Could not find start point "/* Projects List */".');
    }

} catch (e) {
    console.error('Error:', e);
}
