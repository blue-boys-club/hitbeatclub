import {
    Controller,
    Get,
    Post,
    Patch,
    Delete,
    Param,
    Body,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async findAll() {
        return this.userService.findAll();
    }

    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.userService.findOne(id);
    }

    @Patch(':id')
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto
    ) {
        return this.userService.update(id, updateUserDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.userService.remove(id);
    }
}
