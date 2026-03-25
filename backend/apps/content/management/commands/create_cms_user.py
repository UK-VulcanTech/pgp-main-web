from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Create or update a Django staff user for CMS JWT login (/api/manage/v1/auth/login/)."

    def add_arguments(self, parser):
        parser.add_argument("--username", required=True)
        parser.add_argument("--email", default="")
        parser.add_argument("--password", required=True)
        parser.add_argument(
            "--superuser",
            action="store_true",
            help="Grant Django superuser (full CMS + user management).",
        )

    def handle(self, *args, **options):
        User = get_user_model()
        username = options["username"]
        email = options["email"] or ""
        password = options["password"]
        as_super = options["superuser"]

        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                "email": email,
                "is_staff": True,
                "is_active": True,
                "is_superuser": as_super,
            },
        )
        if not created:
            user.email = email
            user.is_staff = True
            user.is_active = True
            if as_super:
                user.is_superuser = True
        user.set_password(password)
        user.save()

        action = "Created" if created else "Updated"
        role = "superuser" if user.is_superuser else "staff"
        self.stdout.write(
            self.style.SUCCESS(f"{action} {role} user {username!r} (CMS login enabled).")
        )
