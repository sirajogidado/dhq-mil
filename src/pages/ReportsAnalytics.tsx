import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, BarChart3, TrendingUp, PieChart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ReportsAnalytics = () => {
  const [reportConfig, setReportConfig] = useState({
    dateFrom: "",
    dateTo: "",
    crimeType: "all",
    region: "all",
    format: "pdf"
  });

  const handleGenerateReport = async () => {
    try {
      if (!reportConfig.dateFrom || !reportConfig.dateTo) {
        toast.error('Please select both start and end dates');
        return;
      }

      // Save report configuration to database
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please login to generate reports');
        return;
      }

      const { error } = await supabase
        .from('reports')
        .insert([{
          report_type: 'Crime Analysis Report',
          date_from: reportConfig.dateFrom,
          date_to: reportConfig.dateTo,
          crime_type: reportConfig.crimeType,
          region: reportConfig.region,
          format: reportConfig.format,
          generated_by: user.id
        }]);

      if (error) throw error;

      toast.success('Report generated successfully!');
      
      // Simulate file download
      const reportData = `Crime Analysis Report
Generated: ${new Date().toLocaleDateString()}
Period: ${reportConfig.dateFrom} to ${reportConfig.dateTo}
Crime Type: ${reportConfig.crimeType}
Region: ${reportConfig.region}
Format: ${reportConfig.format.toUpperCase()}

This is a sample report. In production, this would contain actual data analysis.`;

      const blob = new Blob([reportData], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `crime-report-${reportConfig.dateFrom}-${reportConfig.dateTo}.${reportConfig.format === 'pdf' ? 'txt' : reportConfig.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Failed to generate report');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
        <Button onClick={handleGenerateReport} className="bg-gradient-military text-white">
          <Download className="w-4 h-4 mr-2" />
          Generate Report
        </Button>
      </div>

      <Tabs defaultValue="generator" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generator">Report Generator</TabsTrigger>
          <TabsTrigger value="analytics">Crime Analytics</TabsTrigger>
          <TabsTrigger value="trends">Trend Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="generator" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Report Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date-from">Date From</Label>
                    <Input
                      id="date-from"
                      type="date"
                      value={reportConfig.dateFrom}
                      onChange={(e) => setReportConfig({ ...reportConfig, dateFrom: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date-to">Date To</Label>
                    <Input
                      id="date-to"
                      type="date"
                      value={reportConfig.dateTo}
                      onChange={(e) => setReportConfig({ ...reportConfig, dateTo: e.target.value })}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Crime Type</Label>
                  <Select value={reportConfig.crimeType} onValueChange={(value) => setReportConfig({ ...reportConfig, crimeType: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Crime Types</SelectItem>
                      <SelectItem value="terrorism">Terrorism</SelectItem>
                      <SelectItem value="kidnapping">Kidnapping</SelectItem>
                      <SelectItem value="robbery">Robbery</SelectItem>
                      <SelectItem value="fraud">Fraud</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Region</Label>
                  <Select value={reportConfig.region} onValueChange={(value) => setReportConfig({ ...reportConfig, region: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Regions</SelectItem>
                      <SelectItem value="north-west">North-West</SelectItem>
                      <SelectItem value="north-east">North-East</SelectItem>
                      <SelectItem value="north-central">North-Central</SelectItem>
                      <SelectItem value="south-west">South-West</SelectItem>
                      <SelectItem value="south-east">South-East</SelectItem>
                      <SelectItem value="south-south">South-South</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Output Format</Label>
                  <Select value={reportConfig.format} onValueChange={(value) => setReportConfig({ ...reportConfig, format: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Report</SelectItem>
                      <SelectItem value="csv">CSV Data</SelectItem>
                      <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button onClick={handleGenerateReport} className="w-full bg-gradient-military text-white">
                  <Download className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Report Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  <div className="p-3 bg-muted rounded">
                    <strong>Report Type:</strong> Crime Trends Analysis<br />
                    <strong>Period:</strong> 2025-01-01 to 2025-08-01<br />
                    <strong>Scope:</strong> All Crime Types, North-West Region<br />
                    <strong>Format:</strong> PDF Document
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Report Will Include:</h4>
                    <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                      <li>• Executive Summary</li>
                      <li>• Crime Statistics Overview</li>
                      <li>• Regional Breakdown</li>
                      <li>• Trend Analysis Charts</li>
                      <li>• Most Wanted Updates</li>
                      <li>• Arrest Rate Analysis</li>
                      <li>• Recommendations</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Crime Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Crime by Type Chart</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  Regional Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <PieChart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Regional Distribution</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Arrest Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Monthly Trends</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-destructive">1,234</div>
                <p className="text-sm text-muted-foreground">Total Wanted</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-success">892</div>
                <p className="text-sm text-muted-foreground">Arrests Made</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">72%</div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-secondary">45</div>
                <p className="text-sm text-muted-foreground">New Cases</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Crime Trend Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <TrendingUp className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">Trend Analysis Dashboard</p>
                  <p className="text-sm">
                    Interactive charts showing crime trends over time<br />
                    Monthly patterns, seasonal variations, and predictions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Alert Resolution Times</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>AL001 - Terrorism Alert</span>
                    <span className="text-destructive">2 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span>AL002 - Kidnapping Report</span>
                    <span className="text-success">4 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>AL003 - Robbery Incident</span>
                    <span className="text-primary">1 day</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between font-medium">
                      <span>Average Resolution Time</span>
                      <span>1.2 days</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Incidents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>January 2025</span>
                    <span>50 incidents</span>
                  </div>
                  <div className="flex justify-between">
                    <span>February 2025</span>
                    <span>45 incidents</span>
                  </div>
                  <div className="flex justify-between">
                    <span>March 2025</span>
                    <span>62 incidents</span>
                  </div>
                  <div className="flex justify-between">
                    <span>April 2025</span>
                    <span>38 incidents</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex justify-between font-medium text-success">
                      <span>Trend</span>
                      <span>↓ 12% decrease</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsAnalytics;