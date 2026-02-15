"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Loader2,
  Trash2,
  ShieldCheck,
  User as UserIcon,
} from "lucide-react"
import { formatDate } from "@/lib/constants"
import { toast } from "sonner"

export function AdminUsersClient() {
  const supabase = createClient()

  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [roleFilter, setRoleFilter] = useState("all")

  const fetchUsers = async () => {
    setLoading(true)

    let query = supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false })

    if (roleFilter !== "all") {
      query = query.eq("role", roleFilter)
    }

    const { data } = await query
    setUsers(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [roleFilter])

  const updateRole = async (id: string, newRole: string) => {
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", id)

    if (error) {
      toast.error(error.message)
    } else {
      toast.success(`Role changed to ${newRole}`)
      fetchUsers()
    }
  }

  const deleteUser = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this user?")
    if (!confirmed) return

    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", id)

    if (error) {
      toast.error(error.message)
    } else {
      toast.success("User deleted")
      fetchUsers()
    }
  }

  const roleBadge = (role: string) => {
    if (role === "admin") {
      return (
        <Badge className="bg-primary/10 text-primary border-0">
          <ShieldCheck className="mr-1 h-3 w-3" />
          Admin
        </Badge>
      )
    }

    return (
      <Badge variant="secondary" className="bg-primary text-white">
        <UserIcon className="mr-1 h-3 w-3" />
        User
      </Badge>
    )
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-3xl font-bold">
          User Management
        </h1>

        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="user">Users</SelectItem>
            <SelectItem value="admin">Admins</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : users.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed">
          <p className="font-medium">No users found</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">
                        {user.full_name}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {user.phone || "—"}
                  </TableCell>

                  <TableCell>
                    {roleBadge(user.role)}
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {formatDate(user.created_at)}
                  </TableCell>

                  <TableCell className="text-right flex justify-end gap-2">

                    {/* ROLE DROPDOWN */}
                    <Select
                      value={user.role}
                      onValueChange={(value) =>
                        updateRole(user.id, value)
                      }
                    >
                      <SelectTrigger className="w-28 h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* DELETE */}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => deleteUser(user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
