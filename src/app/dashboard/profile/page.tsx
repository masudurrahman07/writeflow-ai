"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { FileText, Sparkles, Zap } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { apiFetch } from "@/lib/api";
import { getAuthUser, setAuthUser, type AuthUser } from "@/lib/auth";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  bio: z.string().max(500).optional(),
  avatar: z
    .string()
    .max(500)
    .refine(
      (val) => val === "" || /^https?:\/\/.+/i.test(val),
      "Enter a valid URL"
    )
    .optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

interface ProfileUser {
  id: string;
  name: string;
  email: string;
  bio: string;
  avatar: string;
  plan: string;
  role: string;
}

interface ProfileStats {
  documentsThisMonth: number;
  totalWordsGenerated: number;
  aiCallsMade: number;
}

interface ProfileResponse {
  success: boolean;
  data: {
    user: ProfileUser;
    stats: ProfileStats;
  };
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileUser | null>(null);
  const [stats, setStats] = useState<ProfileStats | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", bio: "", avatar: "" },
  });

  const avatarUrl = watch("avatar");

  useEffect(() => {
    async function loadProfile() {
      const auth = getAuthUser();
      if (!auth?.id) {
        setLoading(false);
        return;
      }
      try {
        const res = await apiFetch<ProfileResponse>(`/api/users/${auth.id}`);
        setProfile(res.data.user);
        setStats(res.data.stats);
        reset({
          name: res.data.user.name,
          bio: res.data.user.bio ?? "",
          avatar: res.data.user.avatar ?? "",
        });
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to load profile."
        );
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [reset]);

  const onSubmit = async (data: ProfileForm) => {
    const auth = getAuthUser();
    if (!auth?.id) return;

    setSaving(true);
    try {
      const res = await apiFetch<ProfileResponse>(`/api/users/${auth.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          name: data.name,
          bio: data.bio ?? "",
          avatar: data.avatar ?? "",
        }),
      });
      setProfile(res.data.user);
      setStats(res.data.stats);
      setAuthUser({
        ...auth,
        name: res.data.user.name,
        avatar: res.data.user.avatar,
      } as AuthUser);
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to save profile."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-2xl">
        <Skeleton className="h-24 w-24 rounded-full" />
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!profile) {
    return (
      <p className="text-muted-foreground">Unable to load profile.</p>
    );
  }

  const displayAvatar = avatarUrl || profile.avatar;

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Avatar className="h-20 w-20 border-2 border-border">
          {displayAvatar ? (
            <AvatarImage src={displayAvatar} alt={profile.name} />
          ) : null}
          <AvatarFallback className="text-lg bg-primary/10 text-primary">
            {getInitials(profile.name)}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-foreground">
            {profile.name}
          </h2>
          <p className="text-sm text-muted-foreground">{profile.email}</p>
          {profile.bio && (
            <p className="text-sm text-foreground/80 max-w-md">{profile.bio}</p>
          )}
          <Badge variant="secondary" className="capitalize mt-1">
            {profile.plan} plan
          </Badge>
        </div>
      </div>

      {stats && (
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Docs this month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">
                {stats.documentsThisMonth}
              </p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Words generated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">
                {stats.totalWordsGenerated.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Zap className="h-4 w-4" />
                AI calls made
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">
                {stats.aiCallsMade}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="border-border">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-foreground">
                Name
              </label>
              <Input id="name" {...register("name")} disabled={saving} />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <Input value={profile.email} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">Email cannot be changed</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="bio" className="text-sm font-medium text-foreground">
                Bio
              </label>
              <Textarea
                id="bio"
                rows={4}
                placeholder="Tell us about yourself..."
                {...register("bio")}
                disabled={saving}
              />
              {errors.bio && (
                <p className="text-xs text-destructive">{errors.bio.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="avatar" className="text-sm font-medium text-foreground">
                Avatar URL
              </label>
              <Input
                id="avatar"
                placeholder="https://example.com/avatar.jpg"
                {...register("avatar")}
                disabled={saving}
              />
              {errors.avatar && (
                <p className="text-xs text-destructive">{errors.avatar.message}</p>
              )}
            </div>

            <Button type="submit" disabled={saving}>
              {saving && <Spinner className="h-4 w-4" />}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
