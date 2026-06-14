package com.eript.lms.auth.controller;

import com.eript.lms.auth.entity.rbac.Permission;
import com.eript.lms.auth.entity.rbac.Role;
import com.eript.lms.auth.repository.rbac.PermissionRepository;
import com.eript.lms.auth.repository.rbac.RoleRepository;
import com.eript.lms.exception.DuplicateResourceException;
import com.eript.lms.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/v1/admin/rbac")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class RoleController {

    private final RoleRepository roleRepository;
    private final PermissionRepository permissionRepository;

    // ─── Roles ──────────────────────────────────────────────────────────────

    @GetMapping("/roles")
    public List<Role> listRoles() {
        return roleRepository.findAll();
    }

    @PostMapping("/roles")
    public Role createRole(@RequestBody RoleRequest req) {
        if (roleRepository.existsByName(req.name())) {
            throw new DuplicateResourceException("Role already exists: " + req.name());
        }
        return roleRepository.save(Role.builder()
                .name(req.name()).guardName("web").build());
    }

    @DeleteMapping("/roles/{id}")
    public ResponseEntity<Void> deleteRole(@PathVariable Long id) {
        roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + id));
        roleRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/roles/{id}/permissions")
    public Role assignPermissions(@PathVariable Long id, @RequestBody Set<Long> permissionIds) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + id));
        permissionIds.forEach(pid -> permissionRepository.findById(pid)
                .ifPresent(p -> role.getPermissions().add(p)));
        return roleRepository.save(role);
    }

    @DeleteMapping("/roles/{id}/permissions/{permId}")
    public Role removePermission(@PathVariable Long id, @PathVariable Long permId) {
        Role role = roleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + id));
        role.getPermissions().removeIf(p -> p.getId().equals(permId));
        return roleRepository.save(role);
    }

    // ─── Permissions ─────────────────────────────────────────────────────────

    @GetMapping("/permissions")
    public List<Permission> listPermissions() {
        return permissionRepository.findAll();
    }

    @PostMapping("/permissions")
    public Permission createPermission(@RequestBody PermissionRequest req) {
        if (permissionRepository.existsByName(req.name())) {
            throw new DuplicateResourceException("Permission already exists: " + req.name());
        }
        return permissionRepository.save(Permission.builder()
                .name(req.name()).guardName("web").build());
    }

    @DeleteMapping("/permissions/{id}")
    public ResponseEntity<Void> deletePermission(@PathVariable Long id) {
        permissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Permission not found: " + id));
        permissionRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    record RoleRequest(String name) {}
    record PermissionRequest(String name) {}
}
