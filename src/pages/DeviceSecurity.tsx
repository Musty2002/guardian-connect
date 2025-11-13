import { MobileHeader } from "@/components/MobileHeader";
import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/hooks/useAuth";
import { useDeviceSecurity } from "@/hooks/useDeviceSecurity";
import { Shield, Download, AlertTriangle, CheckCircle, MapPin, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

const DeviceSecurity = () => {
  const { user } = useAuth();
  const { deviceStatus, isTracking, markAsStolen, markAsRecovered, exportData } = useDeviceSecurity(user?.id);

  const getStatusBadge = () => {
    switch (deviceStatus) {
      case 'stolen':
        return <Badge variant="destructive" className="flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Stolen</Badge>;
      case 'recovered':
        return <Badge variant="default" className="flex items-center gap-1 bg-success text-success-foreground"><CheckCircle className="w-3 h-3" /> Recovered</Badge>;
      default:
        return <Badge variant="outline" className="flex items-center gap-1"><Shield className="w-3 h-3" /> Active</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <MobileHeader
        title="Device Security"
        onMenuClick={() => {}}
        onNotificationsClick={() => {}}
      />
      
      <main className="max-w-screen-sm mx-auto px-4 py-6 space-y-6">
        {/* Device Status Card */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-accent/10 rounded-xl">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h2 className="font-bold text-foreground">Device Status</h2>
                <p className="text-sm text-muted-foreground">Current protection level</p>
              </div>
            </div>
            {getStatusBadge()}
          </div>

          {isTracking && (
            <Alert className="mb-4">
              <Activity className="h-4 w-4 animate-pulse" />
              <AlertDescription>
                Intensive tracking mode active. Location updates every 5 minutes.
              </AlertDescription>
            </Alert>
          )}

          {deviceStatus === 'stolen' && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This device has been marked as stolen. All family members have been notified.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-3">
            {deviceStatus === 'active' && (
              <Button
                onClick={markAsStolen}
                variant="destructive"
                className="w-full"
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Mark Device as Stolen
              </Button>
            )}

            {deviceStatus === 'stolen' && (
              <Button
                onClick={markAsRecovered}
                className="w-full bg-success hover:bg-success/90"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark as Recovered
              </Button>
            )}
          </div>
        </Card>

        {/* Features Overview */}
        <Card className="p-6">
          <h3 className="font-bold text-foreground mb-4">Active Protection Features</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-accent mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-foreground">Location Tracking</p>
                <p className="text-xs text-muted-foreground">
                  Continuous GPS monitoring when marked as stolen
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-accent mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-foreground">SIM Change Detection</p>
                <p className="text-xs text-muted-foreground">
                  Instant alerts when SIM card is replaced
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-accent mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-foreground">Security Events</p>
                <p className="text-xs text-muted-foreground">
                  Logs all suspicious activities and access attempts
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Data Backup Section */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-accent/10 rounded-xl">
              <Download className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Data Backup</h3>
              <p className="text-sm text-muted-foreground">Export all your data</p>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            Download a complete backup of all your SafeGuard data including profiles, 
            family connections, safe zones, and activity history.
          </p>

          <Button
            onClick={exportData}
            variant="outline"
            className="w-full"
          >
            <Download className="w-4 h-4 mr-2" />
            Export My Data
          </Button>
        </Card>

        {/* Information Card */}
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription className="text-xs">
            <strong>Privacy Notice:</strong> All tracking data is encrypted and only 
            accessible by you and your designated family members. Export your data 
            anytime to keep a personal backup.
          </AlertDescription>
        </Alert>
      </main>

      <BottomNav />
    </div>
  );
};

export default DeviceSecurity;
